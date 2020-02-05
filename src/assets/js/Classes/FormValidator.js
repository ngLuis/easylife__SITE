export class FormValidator {

    regularExpressions = {
        "INPUT_NAME" : /^[A-Za-z]+$/,
        "INPUT_EMAIL" : /^\S+@\S+\.\S+$/,
        "INPUT_DNI" : /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/,
        "INPUT_PASSWORD" : "",
        "INPUT_PASSWORD1" : "",
        "INPUT_PASSWORD2" : ""
    }

    name;
    email;
    dni;
    passwords;
    password;
        
    constructor(){}

    validateInput(inputType, inputValue) {
        let message = '';

        if ( inputType === 'INPUT_NAME' ) {
                if (!this.regularExpressions.INPUT_NAME.test(inputValue)) {
                    message = 'Debes introducir un nombre';
                    this.name = false;
                } else {
                    this.name = true;
                }
        } else if ( inputType === 'INPUT_EMAIL' ) {
            if ( inputValue === '' ) {
                message = 'Debes introducir un email';
                this.email = false;
            } else if (!this.regularExpressions.INPUT_EMAIL.test(inputValue)) {
                message = 'Formato de email incorrecto';
                this.email = false;
            } else {
                this.email = true;
            }
        } else if ( inputType === 'INPUT_DNI' ) {
            if ( inputValue === '' ) {
                message = 'Debes introducir un dni';
                this.dni = false;
            } else if (!this.regularExpressions.INPUT_DNI.test(inputValue)) {
                message = 'Formato de dni incorrecto';
                this.dni = false;
            } else {
                this.dni = true;
            }
        } else if ( inputType === 'INPUT_PASSWORD1' || inputType === 'INPUT_PASSWORD2' ) {
            if ( this.regularExpressions.INPUT_PASSWORD1 === '' | this.regularExpressions.INPUT_PASSWORD2 === '' ) {
                message = 'Debes escribir ambas contraseña';
            } else if ( !(this.regularExpressions.INPUT_PASSWORD1 === this.regularExpressions.INPUT_PASSWORD2) ) {
                message = 'Las contraseñas no coinciden';
                this.passwords = false;
            } else {
                this.passwords = true;
            }
        } else if ( inputType === 'INPUT_PASSWORD' ) {
            if ( inputValue === '' ) {
                message = 'Debes introducir un password';
                this.password = false;
            } else if( inputValue.length < 8 ) {
                message = "Contraseña de 8 caracteres mínimo";
                this.password = false;
            } else {
                message = "";
                this.password = true;
            }
    }
        return message;
    }

    getButtonState() {
        let buttonDisabled = true;
        if ( this.name && this.passwords && this.email && this.dni ) {
            buttonDisabled = false;
        }
        return buttonDisabled;
    }

    getButtonStateLogin() {
        let buttonDisabled = true;
        if( this.password && this.email ) {
            buttonDisabled = false;
        }
        return buttonDisabled;
    }
}

