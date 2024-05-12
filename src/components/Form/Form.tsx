import { countries } from "../../data/countries";
import styles from "./Form.module.css";
import { useState, ChangeEvent, FormEvent } from "react";
import { SearchType } from "../../types";
import Alert from "./Alert/Alert";

type FormProps = {
    fetchWeather: (search: SearchType) => Promise<void>
}

export default function Form({fetchWeather} : FormProps) {
  const [search, setSearch] = useState<SearchType>({
    city: "",
    country: "",
  });

  const handleChange = (e : ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    setSearch({
        ...search,
        [e.target.name] : e.target.value
    })
  }
  const [alert, setAlert] = useState("")

  const handleSubmit = (e : FormEvent<HTMLFormElement> ) => {
    e.preventDefault()

    if (Object.values(search).includes("")) {
        setAlert("Todos los campos son obligatorios")
        return
    }

    fetchWeather(search)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
        {alert && <Alert>{alert}</Alert>}
      <div className={styles.field}>
        <label htmlFor="city">Ciudad:</label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Ciudad"
          value={search.city}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="country">País:</label>
        <select value={search.country} id="country" name="country" onChange={handleChange}>
          <option value="">--- Seleccione un País ---</option>
          {countries.map((country) => (
            <option value={country.code} key={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <input className={styles.submit} type="submit" value="Consultar Clima" />
    </form>
  );
}
