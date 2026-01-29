
import React, { useRef, useState, useEffect } from 'react';
import { Course } from '../types';
import CourseCard from './CourseCard';

interface CourseRowProps {
  title: string;
  courses: Course[];
}

const CourseRow: React.FC<CourseRowProps> = ({ title, courses }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - clientWidth * 0.7
        : scrollContainerRef.current.scrollLeft + clientWidth * 0.7;
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-12 relative group/row">
      {/* Row Title */}
      <div className="flex items-center justify-between mb-4 px-6 md:px-12">
        <h2 className="text-xl font-bold text-white flex items-center tracking-tight">
          <span className="w-1.5 h-5 bg-blue-600 rounded-full mr-3"></span>
          {title}
        </h2>
        <button className="text-[11px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors">
          Explorar Tudo
        </button>
      </div>
      
      <div className="relative">
        {/* Left Arrow Button */}
        <button 
          onClick={() => scroll('left')}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur border border-slate-800 text-white items-center justify-center transition-all duration-300 hover:bg-slate-800 hover:scale-110 shadow-lg ${!showLeftArrow ? 'hidden' : 'flex'}`}
          aria-label="Voltar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex space-x-4 md:space-x-6 overflow-x-auto hide-scrollbar px-6 md:px-12 py-4"
        >
          {courses.map((course) => (
            <div key={course.id}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button 
          onClick={() => scroll('right')}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur border border-slate-800 text-white items-center justify-center transition-all duration-300 hover:bg-slate-800 hover:scale-110 shadow-lg ${!showRightArrow ? 'hidden' : 'flex'}`}
          aria-label="Avançar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CourseRow;
