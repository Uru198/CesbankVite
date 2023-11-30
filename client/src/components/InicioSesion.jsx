import icono from '../assets/img/icon/logoCb.png'
import '../assets/css/InicioSesion.css'
import axios from "axios";
import { useNavigate, } from "react-router-dom";
import fondo from '../assets/img/FondoAzul.jpg'
import check from '../assets/img/icon/check-circle.svg'
import rechazado from '../assets/img/icon/rechazado.png'

import { useEffect, useState } from 'react';


const InicioSesion = () => {

    const [usuario, setUsuario] = useState(null)

    //Para Formulario de Registro
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [cuentaDeAhorros, setCuentaDeAhorros] = useState("");

    const [emailLogin, setEmailLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");

    //Validaciones
    const [errorRegistro, setErrorsRegistro] = useState({});

    const [firstNameValid, setFirstNameValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);


    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setFirstName(value);
        setFirstNameValid(value.trim() !== '');
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordValid(value.length >= 8);
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setConfirmPasswordValid(value === password);
    };

    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
    };

    //animacion de inicio de sesion correctamente

    const [notification, setNotification] = useState({ message: '', isSuccess: true, isVisible: false });

    const showNotification = (message, isSuccess) => {
        setNotification({ message, isSuccess, isVisible: true });

        // Ocultar la notificación después de 3 segundos
        setTimeout(() => {
            setNotification({ ...notification, isVisible: false });
        }, 3000);

        // Agregar el código para mostrar la notificación3 (Inicio de Sesión Incorrecto) en caso de error
        if (!isSuccess) {
            setTimeout(() => {
                // Muestra la notificación4 después de 1 segundo
                document.getElementById("bienvenideInicioSesionIncorrecto").style.display = "block";
                // Oculta la notificación4 después de 3 segundos
                setTimeout(() => {
                    document.getElementById("bienvenideInicioSesionIncorrecto").style.display = "none";
                }, 1000);
            }, 1000);
        }
    };



    const [errorLogin, setErrorLogin] = useState("");

    const navigate = useNavigate();

    const registro = e => {
        e.preventDefault();
        setTimeout(() => {
            axios.post('http://127.0.0.1:8000/api/register', {
                firstName,
                email,
                password,
                confirmPassword,
                cuentaDeAhorros
            }, { withCredentials: true })
                .then(res => {
                    showNotification('¡Registro Exitoso!', true)
                    setTimeout(() => {
                        navigate("/")
                    }, 3000);
                })
                .catch(err => {
                    showNotification('Ups, algo salió mal. Por favor, verifica tus datos.', false);
                    setErrorsRegistro(err.response.data.errors)
                });
        })
    }


    const login = (e) => {
        e.preventDefault();

        axios.post('http://127.0.0.1:8000/api/login', {
            email: emailLogin,
            password: passwordLogin
        }, { withCredentials: true })
            .then(res => {
                if (res.data.error) {
                    setErrorLogin(res.data.message);
                    setTimeout(() => {
                        showNotification(res.data.message, false)
                    }, 80)
                } else {
                    // Guardar el ID del usuario en alguna variable o estado local
                    const userId = res.data.userId;
                    // Guardar la información del usuario en el estado (si es necesario)
                    setUsuario(res.data.usuario);
                    showNotification('¡Inicio de sesión correcto!', true);
                    setFirstName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    // Redirigir a la página de inicio con el ID del usuario
                    setTimeout(() => {
                        navigate(`/usuarios/:id`);
                    }, 3000);
                }
            })
            .catch(err => console.log(err));

    }





    const [activePanel, setActivePanel] = useState('right-panel');

    useEffect(() => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
            setActivePanel('right-panel');
        });

        signInButton.addEventListener('click', () => {
            setActivePanel('left-panel');
        });

        return () => {
            signUpButton.removeEventListener('click', () => {
                setActivePanel('right-panel');
            });

            signInButton.removeEventListener('click', () => {
                setActivePanel('left-panel');
            });
        };
    }, [activePanel]);

    return (
        <body>
            <img className="fondo" src={fondo} alt=""></img>
            <img src={icono} alt="" className="logoInicio" />
            <div id="container" className={`container ${activePanel === 'right-panel' ? 'right-panel-active' : ''}`}>
                <div className="form-container sign-up-container">
                    <form onSubmit={(e) => { e.preventDefault(); registro(e); handleSubmit(e); }} id="registroForm">
                        <h1>Registrarse</h1>
                        <label htmlFor="firstName"></label>
                        <input type="text" className={`campos ${formSubmitted && !firstNameValid ? 'borde-rojo' : ""}`} placeholder="Nombre" id="firstName" name="firstName" value={firstName} onChange={e => { setFirstName(e.target.value); handleFirstNameChange }} />
                        {errorRegistro && errorRegistro.firstName ? <span>{errorRegistro.firstName.message}</span> : null}
                        <label htmlFor="email"></label>
                        <input type="email" className={`campos ${formSubmitted && !emailValid ? 'borde-rojo' : ""}`} placeholder="Correo Electronico" id="email" name="email" value={email} onChange={e => { setEmail(e.target.value); handleEmailChange }} />
                        {errorRegistro && errorRegistro.email ? <span>{errorRegistro.email.message}</span> : null}
                        <label htmlFor="password"></label>
                        <input type="password" className={`campos ${formSubmitted && !passwordValid ? 'borde-rojo' : ""}`} placeholder="Contraseña" id="password" name="password" value={password} onChange={e => { setPassword(e.target.value); handlePasswordChange }} />
                        {errorRegistro && errorRegistro.password ? <span>{errorRegistro.password.message}</span> : null}
                        <label htmlFor="confirmPassword"></label>
                        <input type="password" className={`campos ${formSubmitted && !confirmPasswordValid ? 'borde-rojo' : ""}`} placeholder="Confirmar Contraseña" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); handleConfirmPasswordChange }} />
                        {errorRegistro && errorRegistro.confirmPassword ? <span>{errorRegistro.confirmPassword.message}</span> : null}
                        <label htmlFor="cuentaDeAhorros" style={{ opacity: 0, visibility: 'hidden', margin: 0, padding: 0 }} ></label>
                        <input type="text" className="campos" style={{ opacity: 0, visibility: 'hidden', margin: 0, padding: 0 }} placeholder="Confirmar Contraseña" id="cuentaDeAhorros" name="cuentaDeAhorros" value={cuentaDeAhorros} onChange={e => setCuentaDeAhorros(e.target.value)} />
                        <button type="submit">Registrarme</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form onSubmit={login} id="inicioSesionForm">
                        <h1>Iniciar Sesion</h1>
                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <span className='spaniniciosesion'>o utilice su cuenta</span>
                        <label htmlFor="emailLogin"></label>
                        <input type="email" className="campos" placeholder="Correo Electronico" id="emailLogin" name="emailLogin" value={emailLogin} onChange={e => setEmailLogin(e.target.value)} />
                        <label htmlFor="passwordLogin"></label>
                        <input type="password" className="campos" placeholder="Contraseña" id="passwordLogin" name="passwordLogin" value={passwordLogin} onChange={e => setPasswordLogin(e.target.value)} />
                        <a href="#">¿Olvido su contraseña?</a>
                        <div id="inicioSesion">
                        </div>
                        {errorLogin !== "" ? <span>{errorLogin}</span> : null}
                        <button type="submit" id="btnIniciar">Iniciar Sesion</button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Bienvenido!</h1>
                            <p>Para mantenerte en contacto con nosotros, inicia sesión con tus datos personales</p>
                            <button className="ghost" id="signIn" onClick={() => setActivePanel('left-panel')}>Iniciar Sesion</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hola, Usuario!</h1>
                            <p>Introduzca sus datos personales y empiece a mirar su banco con nosotros</p>
                            <button className="ghost" id="signUp" onClick={() => setActivePanel('right-panel')}>Registrarse</button>
                        </div>
                    </div>
                </div>
            </div>
            {notification.isVisible && (
                <div className={`notification ${notification.isSuccess ? 'success' : ''}`}>
                    <div >
                        {notification.isSuccess ? (
                            <div class="notification" id="bienvenide">
                                <div class="notification__body">
                                    <img src={check} alt="Success" class="notification__icon " />
                                    Iniciando Sesion! &#128640;
                                </div>
                                <div class="notification__progress"></div>
                            </div>
                        ) : (
                            <div class="notification3" id="bienvenideRegistroIncorrecto">
                                <div class="notification__body">
                                    <img src={rechazado} alt="Success" class="notification__icon" />
                                    Ups, algo salio mal!
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </body>
    )
}

export default InicioSesion