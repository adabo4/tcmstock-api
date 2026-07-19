export function verificationTemplate(code: string) {
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
                      Overenie emailovej adresy
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px;">

                    <p style="font-size:16px;line-height:1.7;">
                      Vitajte v aplikácii <strong>TCM Stock</strong>.
                    </p>

                    <p style="font-size:16px;line-height:1.7;">
                      Na dokončenie registrácie zadajte nasledujúci overovací kód:
                    </p>

                    <div
                      style="
                        margin:40px 0;
                        padding:22px;
                        background:#eef5ff;
                        border:2px dashed #0066cc;
                        border-radius:14px;
                        text-align:center;
                      "
                    >
                      <div
                        style="
                          font-size:40px;
                          font-weight:bold;
                          letter-spacing:8px;
                          color:#0066cc;
                        "
                      >
                        ${code}
                      </div>
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
                      Overovací kód je platný <strong>15 minút</strong>.
                    </div>

                    <p style="font-size:14px;color:#6b7280;">
                      Ak ste si účet nevytvárali, tento email môžete bezpečne ignorovať.
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
