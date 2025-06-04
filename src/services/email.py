import base64
from pathlib import Path
from aiosmtplib import SMTP
from email.message import EmailMessage
from jinja2 import Environment, FileSystemLoader
from src.config.stage_cfg import SMTPConfig, PROJECT_ROOT
from src.api.v1.schemas.email_request import EmailRequest


def create_base64_image_source(photo_url):
    photo_path = PROJECT_ROOT / photo_url.lstrip('/')

    print(photo_path)

    if photo_path.exists():
        print("path_exists")
        photo_data = photo_path.read_bytes()
        photo_base64 = base64.b64encode(photo_data).decode('utf-8')
        photo_extension = photo_path.suffix.lstrip('.').lower()
    else:
        photo_base64 = None
        photo_extension = None

    return f"data:image/{photo_extension};base64,{photo_base64}"


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

        html_content = self._render_template(
            template_file=f"{request.template}.html",
            context=request.context
        )

        if html_content:
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
        else:
            print("Ошибка отправки письма. Отсутствует html шаблон. Возможно, произошла ошибка его формирования")

    def _render_template(
        self,
        template_file: str,
        context: dict
    ) -> str | None:
        try:
            template = self.template_env.get_template(template_file)
            return template.render(**context)
        except Exception as e:
            print(f"Template error ({template_file}): {str(e)}")
            return None

    @staticmethod
    def create_email_request_for_feedback_charity(receiver_email, receiver_fullname):
        return EmailRequest(
            receiver_email=receiver_email,
            context={
                "receiver_fullname": receiver_fullname
            },
            subject="Спасибо за обратную связь!",
            template="feedback_charity"
        )

    @staticmethod
    def create_email_request_on_sailor_add_request_submit(submitted_data):
        return EmailRequest(
            receiver_email=submitted_data.user_email,
            context={
                "created_at": submitted_data.created_at.strftime('%d/%m/%Y %H:%M:%S'),
                "receiver_fullname": submitted_data.user_fullname,
                "name": submitted_data.name,
                "surname": submitted_data.surname,
                "patronymic": submitted_data.patronymic,
                "birth_date": submitted_data.birth_date,
                "death_date": submitted_data.death_date,
                "photo_url": create_base64_image_source(submitted_data.photo_url),
                "admission": submitted_data.admission,
                "biography": submitted_data.biography,
                "additional_information": submitted_data.additional_information,
            },
            subject="Заявка на добавление юнги создана!",
            template="on_submit_sailor_create_request"
        )

    @staticmethod
    def create_email_request_on_sailor_request_approve(receiver_email, receiver_fullname, sailor_fullname, biography_id):
        return EmailRequest(
            receiver_email=receiver_email,
            context={
                "receiver_fullname": receiver_fullname,
                "sailor_fullname": sailor_fullname,
                "biography_id": biography_id
            },
            subject="Заявка на добавление юнги прошла проверку и юнга был добавлен!",
            template="on_approve_sailor_create_request"
        )

    @staticmethod
    def create_email_request_on_sailor_request_reject(receiver_email, receiver_fullname, sailor_fullname):
        return EmailRequest(
            receiver_email=receiver_email,
            context={
                "receiver_fullname": receiver_fullname,
                "sailor_fullname": sailor_fullname
            },
            subject="К сожалению заявка на добавление юнги не прошла проверку!",
            template="welcome"
        )
