import { useWorkout } from '../../../providers/user/workout';

import WorkoutSchedule from './WorkoutSchedule';
import WorkoutList from './WorkoutList';
import WorkoutSession from './WorkoutSession';
import WorkoutDetail from './WorkoutDetail';
import WorkoutSearch from './WorkoutSearch';

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
