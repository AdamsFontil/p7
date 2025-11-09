import React, { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);
  console.log("what is name passed to useCountry,", name);

  useEffect(() => {
    if (!name) return;
    console.log("running useEffect in useCountry");
    const fetchedCountry = async () => {
      try {
        const response = await fetch(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`,
        );
        if (!response.ok) {
          console.log("error occured in the fetching");
          setCountry({ found: false });
          return;
        }
        console.log("response", response);
        const data = await response.json();
        console.log("what is data", data);
        setCountry({ data, found: true });
        console.log("what is country", country);
      } catch (error) {
        console.log("error occured---", error);
        setCountry({ found: false });
      }
    };
    fetchedCountry();
  }, [name]);

  return country;
};

const Country = ({ country }) => {
  if (!country) {
    console.log("no country returning null");
    return null;
  }

  if (!country.found) {
    console.log("country not found", country);
    return <div>country not found...</div>;
  }
  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img
        src={country.data.flags.png}
        height="100"
        alt={`flag of ${country.data.flags.alt}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
