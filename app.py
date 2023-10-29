from flask import Flask, render_template, request, jsonify
from my_captcha import MyCaptcha

app = Flask(__name__, template_folder='templates', static_folder='static')
my_captcha = MyCaptcha()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/captcha', methods=['POST'])
def get_captcha():
    type_captcha = request.json.get('type_captcha')
    element = None
    if type_captcha == 'audio':
        audio_file = my_captcha.create_captcha_audio()
        element = f"<audio id=\"audioPlayer\" controls src='{audio_file}' style='width:100%; autoplay'></audio>"
    elif type_captcha == 'image':
        image_file = my_captcha.create_captcha_image()
        element = f'<img src="{image_file}" style="width:100%">'
        pass
    return jsonify({'innerElement': element})

@app.route('/check_captcha', methods=['POST'])
def check_captcha():
    user_captcha = request.json.get('user_captcha')
    is_valid_captcha = my_captcha.check_captcha(user_captcha)
    return jsonify({'result': is_valid_captcha})

if __name__ == '__main__':
    app.run(debug=True)
