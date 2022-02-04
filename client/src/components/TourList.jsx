import { useAxiosTours } from "../hooks/useAxiosTours";
import TourCard from "./TourCard";

const TourList = () => {
  const { data: tours, loading } = useAxiosTours();

  // Paint products list function
  const paintTours = () => {
    return tours.map((tour) => <TourCard key={tour._id} tour={tour} />);
  };

  return (
    <div>
      {loading && "Cargando..."}
      {paintTours()}
    </div>
  );
};

export default TourList;
