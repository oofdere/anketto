import { SECRET_HCAPTCHA_KEY } from "$env/static/private"
import { PUBLIC_HCAPTCHA_SITE_KEY } from "$env/static/public"
PUBLIC_HCAPTCHA_SITE_KEY

export async function validate(token: string) {
    if (token === '') {
        return false;
    };

    const params = {
        "response": token,
        "secret": SECRET_HCAPTCHA_KEY,
        "sitekey": PUBLIC_HCAPTCHA_SITE_KEY
    };

    const response = await fetch("https://hcaptcha.com/siteverify", {
        method: "POST",
        credentials: "omit",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `response=${params.response}&secret=${params.secret}&sitekey=${params.sitekey}`
    });
    const hcaptcha_json = await response.json();

    if(hcaptcha_json.success === true) {
        return true;
    }
    else {
        console.log(hcaptcha_json);
        return false;
    };
}