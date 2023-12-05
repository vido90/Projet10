import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData(); // Obtient les données via le contexte DataContext
  const [index, setIndex] = useState(0); // Gère l'index de la carte affichée dans le slider
    
  // Effet pour gérer le changement automatique des cartes toutes les 5 secondes

  useEffect(() => {
    const timer = setInterval(() => {
      // Incrémente l'index pour afficher la carte suivante
      setIndex((prevIndex) =>
        prevIndex < (data?.focus?.length || 0) - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => {
      clearInterval(timer); // Nettoie le timer lorsque le composant est démonté ou lorsque les données changent 
    };
  }, [data]);

  // Trie les événements par date décroissante pour afficher le plus récent en premier
  const eventsSortedByDate = data?.focus.sort((evtA, evtB) => {
    const dateA = new Date(evtA.date);
    const dateB = new Date(evtB.date);
    return dateB - dateA;
  });

  return (
    <div className="SlideCardList">
      {/* Map les événements triés pour afficher les cartes */}
      {eventsSortedByDate?.map((event, idx) => (
        <div
          key={event.title}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
            <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div> {/* Affiche le mois à partir de la date */}
            </div>
          </div>
        </div>
      ))}
      {/* Crée la pagination sous forme de radio buttons pour naviguer entre les cartes */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {eventsSortedByDate?.map((eventItem, radioIdx) => (
            <label key={eventItem.id} htmlFor={`radio-${eventItem.id}`} className="point">
              <input
                id={`radio-${eventItem.id}`}
                type="radio"
                name="radio-button"
                checked={index === radioIdx}
                onChange={() => setIndex(radioIdx)}
              />
              <span className={`indicator ${index === radioIdx ? 'active' : ''}`} />  
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
