import { useState, useEffect } from "react";
import { getTours } from "../utils/getTours";

export const useAxiosTours = () => {
  const [state, setState] = useState({
    data: [],
    loading: true,
  });

  useEffect(() => {
    getTours().then((tours) =>
      setState({
        data: tours,
        loading: false,
      })
    );
  }, []);

  return state;
};
