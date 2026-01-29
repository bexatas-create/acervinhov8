
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();

  const handleAccess = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/curso/${course.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div 
      onClick={handleAccess}
      className="flex-none w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] group cursor-pointer"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-800 border border-slate-800 group-hover:border-blue-500/50 transition-all duration-300 shadow-sm group-hover:shadow-blue-900/20 group-hover:shadow-xl">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        
        {/* Mentoria Badge */}
        {course.subject === 'Mentorias' && (
          <div className="absolute top-2 left-2 bg-blue-600 text-[9px] font-black px-2 py-1 rounded shadow-lg z-10 text-white uppercase tracking-widest">
            Mentoria
          </div>
        )}

        {/* Professional Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center justify-between items-center">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Acessar</span>
          </div>
        </div>
      </div>
      
      {/* Course Info below card */}
      <div className="mt-3 px-1">
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1 group-hover:text-blue-400 transition-colors">
          {course.subject}
        </p>
        <h3 className="text-sm font-bold text-slate-100 line-clamp-1 leading-tight group-hover:text-white transition-colors">
          {course.title}
        </h3>
      </div>
    </div>
  );
};

export default CourseCard;
