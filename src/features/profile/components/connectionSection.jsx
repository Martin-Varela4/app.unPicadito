// import React from "react";

// export function ConnectionsSection({ connections = [], count = 0 }) {
//   return (
//     <div className="section-wrapper">
//       <div className="card">
//         <div className="card__header">
//           <h2 className="card__title">Mis conexiones ({count})</h2>
//           <button className="link-button">Ver todas</button>
//         </div>

//         <div className="connections-grid">
//           {connections.map((c, index) => (
//             <div key={c.id || index} className="connections-grid__item">
//               <div className="connections-grid__avatar-wrapper">
//                 <img src={c.avatar} alt={c.name} />
//                 <span className="connections-grid__status-dot" />
//               </div>
//               <p className="connections-grid__name">{c.name}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }