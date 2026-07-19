export function passwordResetTemplate(resetLink: string) {
  return `
    <!DOCTYPE html>
    <html lang="sk">
      <head>
        <meta charset="UTF-8" />
      </head>

      <body style="margin:0;padding:40px 16px;background:#f4f7fb;font-family:Arial,sans-serif;color:#1a1d29;">

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">

              <table
                width="560"
                cellpadding="0"
                cellspacing="0"
                style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.08);"
              >

                <tr>
                  <td
                    align="center"
                    style="padding:32px;background:#0066cc;color:white;"
                  >
                    <h1 style="margin:0;font-size:28px;">
                      TCM Stock
                    </h1>

                    <p style="margin:10px 0 0;font-size:18px;">
                      Obnovenie hesla
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px;">

                    <p style="font-size:16px;line-height:1.7;">
                      Dostali sme žiadosť o obnovenie hesla k vášmu účtu.
                    </p>

                    <p style="font-size:16px;line-height:1.7;">
                      Kliknite na tlačidlo nižšie a nastavte si nové heslo.
                    </p>

                    <div style="text-align:center;margin:40px 0;">
                      <a
                        href="${resetLink}"
                        style="
                          background:#0066cc;
                          color:white;
                          text-decoration:none;
                          padding:15px 28px;
                          border-radius:10px;
                          display:inline-block;
                          font-weight:bold;
                        "
                      >
                        Obnoviť heslo
                      </a>
                    </div>

                    <div
                      style="
                        background:#eef5ff;
                        border-radius:10px;
                        padding:16px;
                        text-align:center;
                        color:#44546f;
                        margin-bottom:24px;
                      "
                    >
                      Odkaz je platný <strong>30 minút</strong>.
                    </div>

                    <p style="font-size:14px;color:#6b7280;">
                      Ak ste o obnovenie hesla nežiadali,
                      tento email môžete bezpečne ignorovať.
                    </p>

                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      padding:20px;
                      background:#f8f9fb;
                      font-size:12px;
                      color:#999;
                    "
                  >
                    © ${new Date().getFullYear()} TCM Stock
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;
}
