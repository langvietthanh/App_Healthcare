/**
 * Tác dụng của file: Điều phối chính và quản lý State toàn cục cho tính năng Luyện tập (Workouts) của người dùng sử dụng API thật.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/user/index.js)
 */
import React, { useState, useEffect } from 'react';
import axiosClient from '../../../config/axiosClient';

import WorkoutSchedule from './WorkoutSchedule';
import WorkoutList from './WorkoutList';
import WorkoutSession from './WorkoutSession';
import WorkoutDetail from './WorkoutDetail';
import WorkoutSearch from './WorkoutSearch';

const Workouts = () => {
  // Navigation State
  const [view, setView] = useState('schedule'); // 'schedule' | 'list' | 'session' | 'detail' | 'search'

  // Search State
  const [activeTab, setActiveTab] = useState('Cardio');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [ratingFilter, setRatingFilter] = useState({ min: '', max: '' });
  const [isCustom, setIsCustom] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Dynamic exercise lists from backend
  const [listExercises, setListExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  // Detail State
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseMode, setExerciseMode] = useState('reps'); // 'reps' | 'time'
  const [sets, setSets] = useState(3);
  const [repsOrTime, setRepsOrTime] = useState(12);
  const [restTime, setRestTime] = useState(30);

  // Schedule State (Mock/Local session schedule)
  const [scheduledExercises, setScheduledExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const tabs = ['Cardio', 'Strength', 'Flexibility', 'Sport'];
  const muscles = ['Ngực', 'Lưng', 'Chân', 'Vai', 'Tay', 'Bụng'];

  // Map muscles to backend
  const muscleMapVE = {
    'Ngực': 'Chest',
    'Lưng': 'Back',
    'Chân': 'Legs',
    'Vai': 'Shoulders',
    'Tay': 'Arms',
    'Bụng': 'Core'
  };

  const muscleMapEV = {
    'Chest': 'Ngực',
    'Back': 'Lưng',
    'Legs': 'Chân',
    'Shoulders': 'Vai',
    'Arms': 'Tay',
    'Core': 'Bụng',
    'Full Body': 'Toàn thân'
  };

  const fetchExercisesFromBackend = async () => {
    setLoading(true);
    try {
      let url = `/exercises?category=${activeTab}`;
      if (search.trim()) {
        url += `&q=${encodeURIComponent(search)}`;
      }
      
      const response = await axiosClient.get(url);
      const data = response.data || response;
      if (Array.isArray(data)) {
        const mapped = data.map((e) => ({
          id: e._id,
          name: e.name,
          rating: e.targetMuscles?.[0]?.rating || 4.8,
          time: '15 phút', // Fallback display time
          kcal: e.category === 'Cardio' ? 300 : 180, // Dynamic estimated calories based on category
          img: e.imgURL || (e.category === 'Cardio' ? '🏃‍♂️' : '🏋️'),
          type: e.category || 'Strength',
          description: e.description || '',
          instructions: e.instructions?.map(ins => ins.text) || [],
          muscles: e.targetMuscles?.map(m => muscleMapEV[m.muscle] || m.muscle) || []
        }));
        setListExercises(mapped);
      }
    } catch (err) {
      console.error('Error loading user exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchExercisesFromBackend();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeTab]);

  const toggleMuscle = (m) => {
    setSelectedMuscles((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const handleResetFilters = () => {
    setSelectedMuscles([]);
    setRatingFilter({ min: '', max: '' });
    setIsCustom(false);
    setIsFavorite(false);
  };

  const handleSelectExercise = (ex) => {
    setSelectedExercise(ex);
    setView('detail');
  };

  const handleSaveToSchedule = () => {
    setScheduledExercises([
      ...scheduledExercises,
      {
        ...selectedExercise,
        mode: exerciseMode,
        sets,
        repsOrTime,
        restTime,
      },
    ]);
    setView('schedule');
  };

  // Render components according to current view
  if (view === 'schedule') {
    return <WorkoutSchedule setView={setView} />;
  }

  if (view === 'list') {
    return (
      <WorkoutList
        setView={setView}
        scheduledExercises={scheduledExercises}
        setCurrentExerciseIndex={setCurrentExerciseIndex}
      />
    );
  }

  if (view === 'session') {
    return (
      <WorkoutSession
        setView={setView}
        scheduledExercises={scheduledExercises}
        currentExerciseIndex={currentExerciseIndex}
        setCurrentExerciseIndex={setCurrentExerciseIndex}
      />
    );
  }

  if (view === 'detail') {
    return (
      <WorkoutDetail
        setView={setView}
        selectedExercise={selectedExercise}
        exerciseMode={exerciseMode}
        setExerciseMode={setExerciseMode}
        sets={sets}
        setSets={setSets}
        repsOrTime={repsOrTime}
        setRepsOrTime={setRepsOrTime}
        restTime={restTime}
        setRestTime={setRestTime}
        handleSaveToSchedule={handleSaveToSchedule}
      />
    );
  }

  return (
    <WorkoutSearch
      setView={setView}
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      muscles={muscles}
      selectedMuscles={selectedMuscles}
      toggleMuscle={toggleMuscle}
      ratingFilter={ratingFilter}
      setRatingFilter={setRatingFilter}
      isCustom={isCustom}
      setIsCustom={setIsCustom}
      isFavorite={isFavorite}
      setIsFavorite={setIsFavorite}
      handleResetFilters={handleResetFilters}
      listExercises={listExercises}
      handleSelectExercise={handleSelectExercise}
      search={search}
      setSearch={setSearch}
    />
  );
};

export default Workouts;
