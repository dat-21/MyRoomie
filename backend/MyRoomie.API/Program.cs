using System.Text;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MyRoomie.API.Middleware;
using MyRoomie.API.Services;
using MyRoomie.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ─── CORS ─────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? ["http://localhost:5173", "http://localhost:5174"];

        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ─── Firebase Firestore ────────────────────────────────────────────────────
var firebaseProjectId = builder.Configuration["Firebase:ProjectId"]
    ?? throw new InvalidOperationException("Firebase:ProjectId is not configured.");

// Ưu tiên 1: FIREBASE_SERVICE_ACCOUNT_JSON (env var, dùng cho Railway/Render/cloud)
// Ưu tiên 2: Firebase:ServiceAccountPath (file, dùng cho local dev)
// Ưu tiên 3: Application Default Credentials (GCP, Cloud Run...)
var serviceAccountJsonEnv = Environment.GetEnvironmentVariable("FIREBASE_SERVICE_ACCOUNT_JSON");
var serviceAccountPath = builder.Configuration["Firebase:ServiceAccountPath"];
var credentialPath = string.IsNullOrEmpty(serviceAccountPath)
    ? null
    : Path.IsPathRooted(serviceAccountPath)
        ? serviceAccountPath
        : Path.Combine(Directory.GetCurrentDirectory(), serviceAccountPath);

FirestoreDb firestoreDb;

if (!string.IsNullOrEmpty(serviceAccountJsonEnv))
{
    // Cloud deploy: đọc credentials từ env var (JSON string)
    using var jsonDoc = System.Text.Json.JsonDocument.Parse(serviceAccountJsonEnv);
    var projectIdFromJson = jsonDoc.RootElement.GetProperty("project_id").GetString()
        ?? firebaseProjectId;

    // Ghi tạm ra file để GOOGLE_APPLICATION_CREDENTIALS có thể đọc
    var tmpPath = Path.Combine(Path.GetTempPath(), "firebase-sa.json");
    File.WriteAllText(tmpPath, serviceAccountJsonEnv);
    Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", tmpPath);
    Environment.SetEnvironmentVariable("GOOGLE_CLOUD_PROJECT", projectIdFromJson);

    firestoreDb = FirestoreDb.Create(projectIdFromJson);
    Console.WriteLine($"[Firebase] Initialized from env var for project: {projectIdFromJson}");
}
else if (!string.IsNullOrEmpty(credentialPath) && File.Exists(credentialPath))
{
    // Local dev: đọc từ file JSON
    using var jsonDoc = System.Text.Json.JsonDocument.Parse(File.ReadAllText(credentialPath));
    var projectIdFromJson = jsonDoc.RootElement.GetProperty("project_id").GetString()
        ?? firebaseProjectId;

    Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialPath);
    Environment.SetEnvironmentVariable("GOOGLE_CLOUD_PROJECT", projectIdFromJson);

    firestoreDb = FirestoreDb.Create(projectIdFromJson);
    Console.WriteLine($"[Firebase] Initialized from file for project: {projectIdFromJson}");
}
else
{
    // GCP/Cloud Run: dùng Application Default Credentials tự động
    firestoreDb = FirestoreDb.Create(firebaseProjectId);
    Console.WriteLine($"[Firebase] Initialized with Application Default Credentials");
}

builder.Services.AddSingleton(firestoreDb);

// ─── JWT Authentication ────────────────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key is not configured.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// ─── Application Services ──────────────────────────────────────────────────
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// ─── Controllers ──────────────────────────────────────────────────────────
builder.Services.AddControllers();

// ─── Swagger ───────────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My Roomie API",
        Version = "v1",
        Description = "Backend API cho ứng dụng tìm phòng và bạn cùng phòng My Roomie"
    });

    // JWT auth trong Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Bearer token. Ví dụ: 'Bearer eyJ...'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ─── Build ────────────────────────────────────────────────────────────────
var app = builder.Build();

// ─── Pipeline ─────────────────────────────────────────────────────────────
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My Roomie API v1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "My Roomie API";
    });
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
