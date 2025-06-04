from aiosmtplib import SMTP
from email.message import EmailMessage
from jinja2 import Environment, FileSystemLoader
from pydantic import EmailStr
from src.config.stage_cfg import SMTPConfig
from src.api.v1.schemas.email_request import EmailRequest

class EmailService:
    def __init__(self, template_dir: str = "src/templates"):
        self.template_env = Environment(
            loader=FileSystemLoader(template_dir),
            autoescape=True,
            trim_blocks=True,
            lstrip_blocks=True
        )

    async def send_email(
        self,
        request: EmailRequest
    ):
        template_context = {
            "email": request.receiver_email,
            "full_name": request.receiver_fullname
        }

        html_content = self._render_template(
            template_file=f"{request.template}.html",
            context=template_context
        )

        message = EmailMessage()
        message["From"] = SMTPConfig.SMTP_USERNAME
        message["To"] = request.receiver_email
        message["Subject"] = request.subject
        message.add_alternative(html_content, subtype="html")

        try:
            async with SMTP(
                hostname=SMTPConfig.SMTP_SERVER_DOMAIN,
                port=SMTPConfig.SMTP_SERVER_PORT,
                use_tls=True
            ) as smtp:
                await smtp.login(
                    SMTPConfig.SMTP_USERNAME,
                    SMTPConfig.SMTP_PASSWORD
                )
                await smtp.send_message(message)
            print(f"Email sent to {request.receiver_email}")
        except Exception as e:
            print(f"Email send error: {str(e)}")
            raise

    def _render_template(
        self,
        template_file: str,
        context: dict
    ) -> str:
        try:
            template = self.template_env.get_template(template_file)
            return template.render(**context)
        except Exception as e:
            print(f"Template error ({template_file}): {str(e)}")
            return f"<h1>Ошибка рендеринга шаблона</h1><p>{str(e)}</p>"

    @staticmethod
    def create_email_request_for_feedback_charity(receiver_email, receiver_fullname):
        return EmailRequest(
            receiver_email=receiver_email,
            receiver_fullname=receiver_fullname,
            subject="Спасибо за обратную связь!",
            template="welcome"
        )

    @staticmethod
    def create_email_request_on_sailor_add_request_submit(receiver_email, receiver_fullname):
        return EmailRequest(
            receiver_email=receiver_email,
            receiver_fullname=receiver_fullname,
            subject="Заявка на добавление юнги создана!",
            template="welcome"
        )

    @staticmethod
    def create_email_request_on_sailor_request_approve(receiver_email, receiver_fullname):
        return EmailRequest(
            receiver_email=receiver_email,
            receiver_fullname=receiver_fullname,
            subject="Заявка на добавление юнги прошла проверку и юнга был добавлен!",
            template="welcome"
        )

    @staticmethod
    def create_email_request_on_sailor_request_reject(receiver_email, receiver_fullname):
        return EmailRequest(
            receiver_email=receiver_email,
            receiver_fullname=receiver_fullname,
            subject="К сожалению заявка на добавление юнги не прошла проверку!",
            template="welcome"
        )