const TourCard = ({ tour }) => {
  const { name, imageCover, summary } = tour;

  return (
    <div className="card__container">
      <h2 className="card__title">{name}</h2>
      <img className="card_img" src={imageCover} alt="" />
      <p className="card__text">{summary} </p>
    </div>
  );
};

export default TourCard;
