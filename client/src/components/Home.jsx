import '../assets/css/Home.css'
import icono from '../assets/img/icon/logoCb.png'
import cerrarsesion from '../assets/img/cerrarsesion.png'
import deposito from '../assets/img/dinero.gif'
import retirar from '../assets/img/retirar.gif'
import transferir from '../assets/img/transferir.gif'
import historial from '../assets/img/historial.gif'
import fondo from '../assets/img/FondoAzul.jpg'
import axios from "axios";
import {useNavigate, useParams, Link} from "react-router-dom";
import {useState, useEffect} from "react";
import Whatsapp from './Whatsapp'
import { useSaldo } from '../components/SaldoContext.jsx';

const Home = () => {
    const { saldo } = useSaldo();

    const {id} = useParams();
    const [usuario, setUsuario] = useState({});
    const [operacion, setOperacion] = useState('');
    const [monto, setMonto] = useState('');
    const [registroOperaciones, setRegistroOperaciones] = useState([]);

    useEffect(() => {
        
        axios.get(`http://127.0.0.1:8000/api/usuarios/65692aefdf2ebe74457ea6b1`, { withCredentials: true })
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
        axios.get("http://127.0.0.1:8000/api/wallets", {withCredentials: true})
            .then(res => setWallets(res.data))
            .catch(err => {
                if(err.response.status === 401) {
                    navegate("/loginRegistro");
                }
            });
    }, [navegate])

    const cerrarSesion = () => {
        axios.get('http://127.0.0.1:8000/api/logout', {withCredentials:true})
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
                    <section id="container-Main-id" class="containerMain">
                        <div class="cardMain">
                            <div class="face face1">
                                <div class="content">
                                    <img src={deposito} alt="" />
                                </div>
                            </div>
                            <div class="face face2">
                                <div class="content">
                                    <p>Recuerda que el cajero automático acepta depósitos colocados dentro de un sobre.</p>
                                    <Link to="/deposito" id="depositar">Realizar acción</Link>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="cardMain">
                            <div class="face face1">
                                <div class="content">
                                    <img src={retirar} alt="" />
                                </div>
                            </div>
                            <div class="face face2">
                                <div class="content">
                                    <p>Hazlo mas facil y retira dinero para ese antojo.</p>
                                    <Link to="/retiro" id="depositar">Realizar acción</Link>
                                </div>
                            </div>
                        </div>
                        <div class="cardMain">
                            <div class="face face1">
                                <div class="content">
                                    <img src={transferir} alt="" />
                                </div>
                            </div>
                            <div class="face face2">
                                <div class="content">
                                    <p>Ten a la mano el numero de cuenta a transferir.</p>
                                    <Link to="/transferencia" id="depositar">Realizar acción</Link>
                                </div>
                            </div>
                        </div>
                        <div class="cardMain">
                            <div class="face face1">
                                <div class="content">
                                    <img src={historial} alt="" />
                                </div>
                            </div>
                            <div class="face face2">
                                <div class="content">
                                    <p>Aqui podras ver tu historial de todos tus movimientos.</p>
                                    <Link to="/historial" id="depositar">Realizar acción</Link>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="card-hover__extra">
                        <h2>Cuenta de ahorro <p>{usuario.cuentaDeAhorros}</p></h2>
                        <div>
                            <h3>Saldo disponible</h3>
                            <p id="saldoActual"> $ {saldo}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Whatsapp phoneNumber={phoneNumber} defaultMessage={defaultMessage}/>
        </body>
    )
}

export default Home