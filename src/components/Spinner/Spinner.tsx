//En este NO usamos modulo ya que los modulos al renderizarse, se optimizan y nombras las clases de diferente manera, por lo que al final no coinciden con el css. En este caso especifico, es mejor una hoja plana de estilos.
import "./Spinner.css"

export default function Spinner() {
  return (
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  );
}
