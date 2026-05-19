import React, { useEffect } from 'react';
import { useWorkout } from '../../../store';

import WorkoutSchedule from './WorkoutSchedule';
import WorkoutList from './WorkoutList';
import WorkoutSession from './WorkoutSession';
import WorkoutDetail from './WorkoutDetail';
import WorkoutSearch from './WorkoutSearch';

const Workouts = () => {
  const {
    state,
    setWorkoutView,
    setWorkoutActiveTab,
    setWorkoutSearch,
    setWorkoutShowFilters,
    setWorkoutSelectedMuscles,
    setWorkoutRatingFilter,
    setWorkoutIsCustom,
    setWorkoutIsFavorite,
    setWorkoutSelectedExercise,
    setWorkoutExerciseMode,
    setWorkoutSets,
    setWorkoutRepsOrTime,
    setWorkoutRestTime,
    setScheduledExercises,
    setCurrentExerciseIndex,
    fetchExercisesFromBackend
  } = useWorkout();

  const {
    view, activeTab, search, showFilters, selectedMuscles, ratingFilter,
    isCustom, isFavorite, listExercises, loading,
    selectedExercise, exerciseMode, sets, repsOrTime, restTime,
    scheduledExercises, currentExerciseIndex
  } = state;

  const tabs = ['Cardio', 'Strength', 'Flexibility', 'Sport'];
  const muscles = ['Ngực', 'Lưng', 'Chân', 'Vai', 'Tay', 'Bụng'];

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExercisesFromBackend();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeTab]); // re-fetch when search or tab changes

  const toggleMuscle = (m) => {
    if (selectedMuscles.includes(m)) {
      setWorkoutSelectedMuscles(selectedMuscles.filter((x) => x !== m));
    } else {
      setWorkoutSelectedMuscles([...selectedMuscles, m]);
    }
  };

  const handleResetFilters = () => {
    setWorkoutSelectedMuscles([]);
    setWorkoutRatingFilter({ min: '', max: '' });
    setWorkoutIsCustom(false);
    setWorkoutIsFavorite(false);
  };

  const handleSelectExercise = (ex) => {
    setWorkoutSelectedExercise(ex);
    setWorkoutView('detail');
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
    setWorkoutView('search');
  };

  if (view === 'schedule') {
    return <WorkoutSchedule setView={setWorkoutView} />;
  }

  if (view === 'list') {
    return (
      <WorkoutList
        setView={setWorkoutView}
        scheduledExercises={scheduledExercises}
        setCurrentExerciseIndex={setCurrentExerciseIndex}
      />
    );
  }

  if (view === 'session') {
    return (
      <WorkoutSession
        setView={setWorkoutView}
        scheduledExercises={scheduledExercises}
        currentExerciseIndex={currentExerciseIndex}
        setCurrentExerciseIndex={setCurrentExerciseIndex}
      />
    );
  }

  if (view === 'detail') {
    return (
      <WorkoutDetail
        setView={setWorkoutView}
        selectedExercise={selectedExercise}
        exerciseMode={exerciseMode}
        setExerciseMode={setWorkoutExerciseMode}
        sets={sets}
        setSets={setWorkoutSets}
        repsOrTime={repsOrTime}
        setRepsOrTime={setWorkoutRepsOrTime}
        restTime={restTime}
        setRestTime={setWorkoutRestTime}
        handleSaveToSchedule={handleSaveToSchedule}
      />
    );
  }

  return (
    <WorkoutSearch
      setView={setWorkoutView}
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setWorkoutActiveTab}
      showFilters={showFilters}
      setShowFilters={setWorkoutShowFilters}
      muscles={muscles}
      selectedMuscles={selectedMuscles}
      toggleMuscle={toggleMuscle}
      ratingFilter={ratingFilter}
      setRatingFilter={setWorkoutRatingFilter}
      isCustom={isCustom}
      setIsCustom={setWorkoutIsCustom}
      isFavorite={isFavorite}
      setIsFavorite={setWorkoutIsFavorite}
      handleResetFilters={handleResetFilters}
      listExercises={listExercises}
      handleSelectExercise={handleSelectExercise}
      search={search}
      setSearch={setWorkoutSearch}
    />
  );
};

export default Workouts;
