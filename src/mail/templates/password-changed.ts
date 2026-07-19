export function passwordChangedTemplate() {
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
                      Heslo bolo úspešne zmenené
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px;">

                    <p style="font-size:16px;line-height:1.7;">
                      Vaše heslo k účtu <strong>TCM Stock</strong> bolo úspešne zmenené.
                    </p>

                    <div
                      style="
                        margin:32px 0;
                        padding:18px;
                        background:#eef8f1;
                        border-left:4px solid #22c55e;
                        border-radius:10px;
                        color:#166534;
                      "
                    >
                      ✓ Ak ste túto zmenu vykonali vy, nie je potrebné robiť žiadne ďalšie kroky.
                    </div>

                    <div
                      style="
                        margin:24px 0;
                        padding:18px;
                        background:#fff4f4;
                        border-left:4px solid #ef4444;
                        border-radius:10px;
                        color:#991b1b;
                      "
                    >
                      <strong>Nevykonali ste túto zmenu?</strong><br><br>

                      Odporúčame vám čo najskôr obnoviť heslo a skontrolovať bezpečnosť svojho účtu.
                    </div>

                    <p style="font-size:14px;color:#6b7280;">
                      Tento email slúži iba ako bezpečnostné upozornenie.
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
