import '../assets/css/Historial.css'
import icono from '../assets/img/icon/logoCb.png'
import cerrarsesion from '../assets/img/cerrarsesion.png'
import arrow from '../assets/img/arrow.png'
import fondo from '../assets/img/FondoAzul.jpg'
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Whatsapp from './Whatsapp'
import { useSaldo } from '../components/SaldoContext.jsx';

const Historial = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState({});
    const [transferencias, setTransferencias] = useState([]);
    const [wallets, setWallets] = useState([]);
    const { saldo } = useSaldo();
    const navegate = useNavigate();

    const [busqueda, setBusqueda] = useState("");
    const [resultadosFiltrados, setResultadosFiltrados] = useState([]);

    //formato de fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    };

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

    //------

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/wallets", { withCredentials: true })
            .then(res => setWallets(res.data))
            .catch(err => {
                if (err.response.status === 401) {
                    navegate("/loginRegistro");
                }
            });
    }, [navegate])


    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/transferencias", { withCredentials: true })
            .then(res => setTransferencias(res.data))
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
    //funciones de busqueda
    const buscarResultados = () => {
        const resultadosWallets = wallets.filter((wallet) =>
            wallet.tipo_accion.toLowerCase().includes(busqueda.toLowerCase()) ||
            wallet.monto.toString().includes(busqueda) ||
            formatDate(wallet.createdAt).includes(busqueda)
        );

        const resultadosTransferencias = transferencias.filter((transferencia) => {
            const numeroTransferenciaStr = transferencia.numeroTransferencia.toString();
            return (
                transferencia.tipo_accion.toLowerCase().includes(busqueda.toLowerCase()) ||
                transferencia.banco.toLowerCase().includes(busqueda.toLowerCase()) ||
                transferencia.monto.toString().includes(busqueda) ||
                numeroTransferenciaStr.includes(busqueda) ||
                formatDate(transferencia.createdAt).includes(busqueda)
            );
        });

        const resultados = [...resultadosWallets, ...resultadosTransferencias];
        setResultadosFiltrados(resultados);
    };

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
                            <div class="info-title">
                                <div class="wrap">
                                    <div class="search">
                                        <input type="text" class="searchTerm" placeholder="Que quieres buscar?" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                                        <button type="submit" class="searchButton" onClick={buscarResultados}>
                                            <div class="i"> <i class="fa fa-search"></i></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="info-list">
                                <div>
                                    <p style={{ marginTop: 0, padding: '0 0 0 40px', fontWeight: 'bold', borderBottom: '1px solid lightgrey', margin: 0 }}>Movimientos</p>
                                    <div class="scroll-container" id="registroOperaciones">
                                    {
                                        (busqueda === "" ? wallets : []).map((wallet, index) => (
                                            <tr key={index} className='tr'>
                                                <div className='card'>
                                                    Operacion: {wallet.tipo_accion}
                                                    <br />
                                                    Monto: ${wallet.monto}
                                                    <br />
                                                    fecha: {formatDate(wallet.createdAt)}
                                                </div>
                                            </tr>
                                        ))
                                    }
                                    {
                                        (busqueda === "" ? transferencias : resultadosFiltrados).map((item, index) => (
                                            <tr key={index} className='tr'>
                                                <div className='card'>
                                                    {item.tipo_accion === "Transferencia" && (
                                                        <>
                                                            Operacion: {item.tipo_accion}
                                                            <br />
                                                            {item.banco && `Banco: ${item.banco}`}
                                                            <br />
                                                            Monto: ${item.monto}
                                                            <br />
                                                            {item.numeroTransferencia && `Numero de cuenta: ${item.numeroTransferencia}`}
                                                            <br />
                                                            fecha: {formatDate(item.createdAt)}
                                                        </>
                                                    )}

                                                    {(item.tipo_accion === "Deposito" || item.tipo_accion === "Retiro") && (
                                                        <>
                                                            Operacion: {item.tipo_accion}
                                                            <br />
                                                            Monto: ${item.monto}
                                                            <br />
                                                            fecha: {formatDate(item.createdAt)}
                                                        </>
                                                    )}
                                                </div>
                                            </tr>
                                        ))
                                    }
                                    </div>
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
            <Whatsapp phoneNumber={phoneNumber} defaultMessage={defaultMessage} />
        </body>
    )
}

export default Historial