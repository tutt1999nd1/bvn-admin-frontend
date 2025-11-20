import './App.css';
import RenderRoute from "./routes";
import 'react-toastify/dist/ReactToastify.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import {ToastContainer} from "react-toastify";
import { initializeFileTypeIcons } from '@uifabric/file-type-icons';
import { pdfjs } from 'react-pdf';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
function App() {

    // pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    //     'pdfjs-dist/build/pdf.worker.min.mjs',
    //     import.meta.url,
    // ).toString();
    initializeFileTypeIcons();
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <RenderRoute></RenderRoute>
        </>);
}

export default App;
