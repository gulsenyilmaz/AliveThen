
import React, { useRef, useState, useEffect } from "react";
import "./WorksTimeline.css";

const WorksTimeline = ({ selectedPerson, works, selectedYear }) => {
 
  const stripRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollAmount = 150;

  const scrollWorks = (direction) => {
    
    if (stripRef.current) {
      stripRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateScrollButtons = () => {
    const el = stripRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = stripRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
    }

    return () => {
      if (el) {
        el.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      }
    };
  }, [works]); 

  const [modalImageUrl, setModalImageUrl] = useState(null);

  const openImageModal = (url) => {
    setModalImageUrl(url);
  };

  const closeImageModal = () => {
    setModalImageUrl(null);
  };

    const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    const el = stripRef.current;
    if (!el) return;

    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const el = stripRef.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5; // scroll hız faktörü
    el.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };
    


  return (
    <>
      {works.length > 0 ? (
        <div className="works-strip-container">
           {canScrollLeft && (
            <button className="scroll-button left" onClick={() => scrollWorks(-1)}>
              ⟨
            </button>
          )}

          <div
              className="works-strip"
              ref={stripRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            >
            {works.map((a) =>
              a.title ? (
                <div key={a.id} className="work-item">
                  <img
                      src={a.image_url}
                      alt={a.title}
                      className="work-item-img"
                      onClick={() => openImageModal(a.image_url)}
                      style={{ cursor: "pointer" }}
                    />

                  <a href={a.url} target="_blank" rel="noreferrer" className="work-item-title">
                    <strong>{a.title}</strong>
                  </a>
                  <div className="work-item-meta">{a.date} · {a.description}</div>
                </div>
              ) : null
            )}
          </div>

           {canScrollRight && (
            <button className="scroll-button right" onClick={() => scrollWorks(1)}>
              ⟩
            </button>
          )}
        </div>
      ) : (
        <p className="no-works">No works found.</p>
      )}

      {modalImageUrl && (
        <div className="modal-overlay" onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImageUrl} alt="Artwork" className="modal-image" />
            <button className="modal-close" onClick={closeImageModal}>✕</button>
          </div>
        </div>
      )}
     </>  
    
  );
};

export default WorksTimeline;