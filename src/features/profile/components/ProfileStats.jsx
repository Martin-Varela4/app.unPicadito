// import React from "react";
// import { Circle, Trophy, Target } from "lucide-react";

// export function StatsBar({ stats = [] }) {
//   return (
//     <div className="section-wrapper">
//       <div className="stats-bar">
//         {stats.map(({ icon: Icon, label, value }) => (
//           <div key={label} className="stats-bar__item">
//             {Icon ? (
//               <Icon size={28} className="stats-bar__icon" />
//             ) : (
//               <span className="stats-bar__emoji">👟</span>
//             )}
//             <p className="stats-bar__value">{value}</p>
//             <p className="stats-bar__label">{label}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }