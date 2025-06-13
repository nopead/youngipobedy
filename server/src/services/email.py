from aiosmtplib import SMTP
from email.message import EmailMessage
from jinja2 import Environment, FileSystemLoader
from src.config.stage_cfg import SMTP_USERNAME, SMTP_PASSWORD, SMTP_SERVER_PORT, SMTP_SERVER_DOMAIN
from src.api.v1.schemas.email_request import EmailRequest
from src.services.photo import create_base64_image_source


class EmailService:
    def __init__(self, template_dir: str = "src/templates"):
        self.template_env = Environment(
            loader=FileSystemLoader(template_dir),
            autoescape=True,
            trim_blocks=True,
            lstrip_blocks=True
        )

    async def send_email(self, request: EmailRequest):
        html_content = self._render_template(template_file=f"{request.template}.html", context=request.context)
        if html_content:
            message = EmailMessage()
            message["From"] = SMTP_USERNAME
            message["To"] = request.receiver_email
            message["Subject"] = request.subject
            message.add_alternative(html_content, subtype="html")

            try:
                async with SMTP(hostname=SMTP_SERVER_DOMAIN, port=SMTP_SERVER_PORT, use_tls=True) as smtp:
                    await smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
                    await smtp.send_message(message)
                print(f"Email sent to {request.receiver_email}")
            except Exception as e:
                print(f"Email send error: {str(e)}")
                raise
        else:
            print("Ошибка отправки письма. Отсутствует html шаблон. Возможно, произошла ошибка его формирования")

    def _render_template(self, template_file: str, context: dict
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
        birth_day = str(submitted_data.birth_day) if submitted_data.birth_day is not None else "_"
        birth_month = str(submitted_data.birth_month) if submitted_data.birth_month is not None else "_"
        birth_year = str(submitted_data.birth_year) if submitted_data.birth_year is not None else "_"
        birth_date = f"{birth_day}.{birth_month}.{birth_year}"

        death_day = str(submitted_data.death_day) if submitted_data.death_day is not None else "_"
        death_month = str(submitted_data.death_month) if submitted_data.death_month is not None else "_"
        death_year = str(submitted_data.death_year) if submitted_data.death_year is not None else "_"
        death_date = f"{death_day}.{death_month}.{death_year}"
        return EmailRequest(
            receiver_email=submitted_data.user_email,
            context={
                "created_at": submitted_data.created_at.strftime('%d/%m/%Y %H:%M:%S'),
                "request_id": submitted_data.id,
                "receiver_fullname": submitted_data.user_fullname,
                "name": submitted_data.name,
                "surname": submitted_data.surname,
                "patronymic": submitted_data.patronymic,
                "birth_date": birth_date,
                "death_date": death_date,
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
            template="on_reject_sailor_create_request"
        )
