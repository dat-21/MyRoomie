using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MyRoomie.API.Services.Interfaces;

namespace MyRoomie.API.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendOtpEmailAsync(string toEmail, string toName, string otpCode)
    {
        var smtpHost = _config["Email:SmtpHost"];
        if (string.IsNullOrWhiteSpace(smtpHost))
        {
            smtpHost = "smtp.gmail.com";
        }
        smtpHost = smtpHost.Trim();
        if (smtpHost.Contains("://"))
        {
            try
            {
                var uri = new Uri(smtpHost);
                smtpHost = uri.Host;
            }
            catch 
            {
                smtpHost = "smtp.gmail.com";
            }
        }

        var smtpPortStr = _config["Email:SmtpPort"];
        int smtpPort = 587;
        if (!string.IsNullOrWhiteSpace(smtpPortStr))
        {
            if (!int.TryParse(smtpPortStr.Trim(), out smtpPort))
            {
                smtpPort = 587;
            }
        }

        var senderEmail = _config["Email:SenderEmail"]?.Trim()
            ?? throw new InvalidOperationException("Email:SenderEmail not configured.");
        var senderName = _config["Email:SenderName"] ?? "My Roomie";
        var appPassword = _config["Email:AppPassword"]?.Trim()
            ?? throw new InvalidOperationException("Email:AppPassword not configured.");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(senderName, senderEmail));
        message.To.Add(new MailboxAddress(toName, toEmail));
        message.Subject = $"[My Roomie] Mã xác thực OTP: {otpCode}";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = BuildOtpEmailHtml(toName, otpCode)
        };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        client.Timeout = 5000; // Giới hạn chờ 5 giây để tránh bị treo (loading) lâu nếu cổng SMTP bị chặn
        try
        {
            await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(senderEmail, appPassword);
            await client.SendAsync(message);
            _logger.LogInformation("OTP email sent to {Email}", toEmail);
        }
        finally
        {
            await client.DisconnectAsync(true);
        }
    }

    private static string BuildOtpEmailHtml(string name, string otpCode)
    {
        var digits = otpCode.ToCharArray();
        var digitBoxes = string.Join("", digits.Select(d =>
            $"<span style='display:inline-block;width:48px;height:56px;line-height:56px;text-align:center;" +
            $"font-size:28px;font-weight:700;border-radius:10px;margin:0 4px;" +
            $"background:#f0f4ff;color:#4F46E5;border:2px solid #c7d2fe;'>{d}</span>"));

        return $"""
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8"/>
              <meta name="viewport" content="width=device-width,initial-scale=1"/>
            </head>
            <body style="margin:0;padding:0;background:#f5f7ff;font-family:'Segoe UI',sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7ff;padding:40px 0;">
                <tr><td align="center">
                  <table width="560" cellpadding="0" cellspacing="0"
                    style="background:#ffffff;border-radius:24px;overflow:hidden;
                           box-shadow:0 8px 40px rgba(79,70,229,.12);">

                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);
                                 padding:36px 40px;text-align:center;">
                        <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
                          🏠 My Roomie
                        </h1>
                        <p style="margin:8px 0 0;color:rgba(255,255,255,.8);font-size:14px;">
                          Xác thực email của bạn
                        </p>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:40px;">
                        <p style="margin:0 0 8px;color:#374151;font-size:16px;">Xin chào <strong>{name}</strong>,</p>
                        <p style="margin:0 0 28px;color:#6b7280;font-size:14px;line-height:1.6;">
                          Đây là mã OTP để xác thực tài khoản <strong>My Roomie</strong> của bạn.
                          Mã có hiệu lực trong <strong>5 phút</strong>.
                        </p>

                        <!-- OTP digits -->
                        <div style="text-align:center;margin:28px 0;">
                          {digitBoxes}
                        </div>

                        <p style="margin:28px 0 0;color:#9ca3af;font-size:12px;text-align:center;line-height:1.6;">
                          Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.<br/>
                          Mã sẽ tự động hết hạn sau 5 phút.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #f3f4f6;
                                 text-align:center;">
                        <p style="margin:0;color:#d1d5db;font-size:11px;">
                          © 2024 My Roomie · Đà Nẵng, Việt Nam
                        </p>
                      </td>
                    </tr>

                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """;
    }
}
