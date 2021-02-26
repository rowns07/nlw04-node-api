import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

class SendMailService {
    private client: Transporter;
    constructor() {
        nodemailer.createTestAccount()
            .then(account => {
                const transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass,
                    },
                });
                this.client = transporter;
            })
    }

    async execute(to: string, subject: string, variables: Object, path: string) {


        // Leitura do arquivo
        const templateFileContent = fs.readFileSync(path).toString("utf8");

        // Compilando o template
        const mailTemplateParse = handlebars.compile(templateFileContent);

        // Parseando as variaveis
        const html = mailTemplateParse(
            variables
        )

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS<noreplay@nps.com.br>"
        })
        console.log('Message sent: %s', message.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default new SendMailService();