import { useState, useEffect } from 'react';
import axiosClient from '../../../config/axiosClient';
import UserGoalsDistribution from './UserGoalsDistribution';
import ModerationStatus from './ModerationStatus';
import TopContributorsTable from './TopContributorsTable';

const DeepAnalysisSection = () => {
  const [reportRange, setReportRange] = useState('7d');
  const [userActivity, setUserActivity] = useState(null);
  const [moderation, setModeration] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const to = new Date().toISOString().split('T')[0];
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - (reportRange === '7d' ? 7 : reportRange === '30d' ? 30 : 90));
        const from = fromDate.toISOString().split('T')[0];

        const [userActivityRes, moderationRes] = await Promise.all([
          axiosClient.get(`/reports/admin/user-activity?from=${from}&to=${to}`),
          axiosClient.get(`/reports/admin/moderation?from=${from}&to=${to}`),
        ]);

        setUserActivity(userActivityRes);
        setModeration(moderationRes);
      } catch (err) {
        console.error('Error fetching admin reports:', err);
      }
    };

    fetchReports();
  }, [reportRange]);

  return (
    <>
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Phân tích chuyên sâu</h2>
          <p className="text-zinc-500 text-sm">Hoạt động & kiểm duyệt nội dung</p>
        </div>
        <div className="flex gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setReportRange(r)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${reportRange === r ? 'bg-[#c8f31d] text-black' : 'text-zinc-400 hover:text-white'
                }`}
            >
              {r === '7d' ? '7 ngày' : r === '30d' ? '30 ngày' : '90 ngày'}
            </button>
          ))}
        </div>
      </div>

      {(userActivity && moderation) ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Phân bổ mục tiêu */}
            <UserGoalsDistribution goalDistribution={userActivity.goalDistribution} />
            {/* Kiểm duyệt */}
            <ModerationStatus statusBreakdown={moderation.statusBreakdown} />
          </div>
          {/* Top đóng góp */}
          <TopContributorsTable topContributors={moderation.topContributors} />
        </>
      ) : (
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-[#c8f31d] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </>
  );
};

export default DeepAnalysisSection;
