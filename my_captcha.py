from captcha.audio import AudioCaptcha
from captcha.image import ImageCaptcha
import random
import string
import os

class MyCaptcha:
    def __init__(self):
        self.captcha = None
        pass

    def create_captcha_image(self):
        img_files = [file for file in os.listdir('static') if file.startswith('img') and file.endswith('.png')]
        for img_file in img_files:
            os.remove(os.path.join('static', img_file))

        image = ImageCaptcha(width=300, height=100)
        self.captcha = MyCaptcha.generate_captcha(only_digits=False)
        print(self.captcha)
        data = image.generate(self.captcha)
        s = MyCaptcha.generate_captcha()
        img_file = f"static/img{s}.png"
        image.write(self.captcha,  img_file)
        return img_file

    def create_captcha_audio(self):
        audio_files = [file for file in os.listdir('static') if file.startswith('audio') and file.endswith('.wav')]
        for audio_file in audio_files:
            os.remove(os.path.join('static', audio_file))

        audio = AudioCaptcha()
        self.captcha = MyCaptcha.generate_captcha(only_digits=True)
        print(self.captcha)
        audio_data = audio.generate(self.captcha)
        s = MyCaptcha.generate_captcha()
        audio_file = f'static/audio{s}.wav'
        audio.write(self.captcha, audio_file)
        return audio_file

    @staticmethod
    def generate_captcha(only_digits=False):
        length = random.randint(6, 8)
        digits = string.digits
        if not only_digits:
            digits += string.ascii_letters
        random_captcha = ''.join(random.choice(digits) for _ in range(length))
        return random_captcha

    def check_captcha(self, input_user):
        return self.captcha == input_user

