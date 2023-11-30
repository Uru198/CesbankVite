import '../assets/css/Transferencia.css'
import icono from '../assets/img/icon/logoCb.png'
import cerrarsesion from '../assets/img/cerrarsesion.png'
import arrow from '../assets/img/arrow.png'
import fondo from '../assets/img/FondoAzul.jpg'
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Whatsapp from './Whatsapp'

const Transferencia = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState({});

    useEffect(() => {
        // Usar el ID del usuario obtenido de la URL o del estado local
        axios.get(`http://127.0.0.1:8000/api/usuarios/656619d815cd9cf1f2603b66`, { withCredentials: true })
            .then(res => {
                setUsuario(res.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    //WhatSapp

    const phoneNumber = '+573225962363';

    const defaultMessage = 'Hola, me podrias ayudar en...';

    const [wallets, setWallets] = useState([]);


    const navegate = useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/wallets", { withCredentials: true })
            .then(res => setWallets(res.data))
            .catch(err => {
                if (err.response.status === 401) {
                    navegate("/loginRegistro");
                }
            });
    }, [navegate])

    const cerrarSesion = () => {
        axios.get('http://127.0.0.1:8000/api/logout', { withCredentials: true })
            .then(res => navegate('/loginRegistro'))
            .catch(err => console.log(err));
    }
    return (
        <body>
            <img class="fondo" src={fondo} alt=""></img>
            <div class="containerPrincipal" id="containerPrincipal">
                <div class="card-hover">
                    <div class="card-hover__content">
                        <img src={icono} alt="" id="logo" />
                        <button for="toggleButton" class="card-hover__link">Tu cartera</button>
                        <img src={cerrarsesion} alt="" id="cerrarSesion" onClick={cerrarSesion} />
                        <h1 class="card-hover__title">
                            Hola, <span id="informacion" class="informacion">{usuario.firstName}</span>
                        </h1>
                    </div>
                    <section id="sectionDepositar">
                        <div class="info_box">
                            <Link to="/"><img src={arrow} alt="flecha" id="logoflecha2" /></Link>
                            <div className="info-title" style={{ borderBottom: '1px solid rgba(163, 163, 163, 0.658)' }}>
                                <h1>Transferencias</h1>
                            </div>
                            <div class="info-list">
                                <div class="scroll-container4">
                                    <form action="" class="formRetiro" id="operacionTransferir">
                                        <div class="labelCard-transferencia">
                                            <div style={{opacity: 0, visibility: 'hidden', display: 'none'}}>
                                                <label class="labelDeposito" for="operacion3" >Tipo de operacion:</label>
                                                <select id="operacion3" class="inputDeposito input-password" >
                                                    <option value="Transferencia">Transferencia</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label for="name" class="labelDeposito" >Nombre</label>
                                                <input type="text" id="name3"  class="inputDeposito input-name" />
                                                <label for="cedula" class="labelDeposito">Cedula</label>
                                                <input type="text" id="cedula3"  class="inputDeposito input-email" />
                                            </div>
                                            <div>
                                                <label for="monto3" class="labelDeposito" >Monto</label>
                                                <input type="number" id="monto3" class="inputDeposito input-password" />
                                                <label for="monto" class="labelDeposito" >Numero de cuenta</label>
                                                <input type="text" id="numeroTransferencia"  class="inputDeposito input-password" />
                                            </div>
                                            <div>
                                                <label for="Banco" class="labelDeposito" >Banco</label>
                                                <input type="text" id="banco"  class="inputDeposito input-password" />
                                                <label class="labelDeposito" style={{ paddingBlock: '5px' }}>Tipo de cuenta</label>
                                                <select class="inputDeposito input-password" id="tipocuenta3">
                                                    <option value="Ahorros">Ahorros</option>
                                                    <option value="Corriente">Corriente</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" value="Retirar" class="primary-button login-button" onclick="AgregarInformacionfactura()">Transferir</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="card-hover__extra">
                        <h2>Cuenta de ahorro <p>{usuario.cuentaDeAhorros}</p></h2>
                        <div>
                            <h3>Saldo disponible</h3>
                            <p id="saldoActual"> $ 0</p>
                        </div>
                    </div>
                </div>
            </div>
            <Whatsapp phoneNumber={phoneNumber} defaultMessage={defaultMessage} />
        </body>
    )
}

export default Transferencia