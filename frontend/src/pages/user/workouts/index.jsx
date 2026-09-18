import { useWorkout } from '../../../providers/user/workout';

import WorkoutSchedule from './components/views/WorkoutSchedule';
import WorkoutList from './components/views/WorkoutList';
import WorkoutSession from './components/views/WorkoutSession';
import WorkoutDetail from './components/views/WorkoutDetail';
import WorkoutSearch from './components/views/WorkoutSearch';

const Workouts = () => {
  const { state } = useWorkout();
  const { view } = state;

  if (view === 'schedule') return <WorkoutSchedule />;
  if (view === 'list') return <WorkoutList />;
  if (view === 'session') return <WorkoutSession />;
  if (view === 'detail') return <WorkoutDetail />;

  return <WorkoutSearch />;
};

export default Workouts;
