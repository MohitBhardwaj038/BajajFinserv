import UserInfoCard from './UserInfoCard';
import HierarchyCard from './HierarchyCard';
import InvalidEntriesCard from './InvalidEntriesCard';
import DuplicateEdgesCard from './DuplicateEdgesCard';
import SummaryCard from './SummaryCard';

/**
 * Orchestrates all response cards.
 */
export default function ResponseDisplay({ data }) {
  if (!data) return null;

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-xs font-semibold text-white/30 tracking-widest uppercase">
          Results
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Summary */}
      <SummaryCard summary={data.summary} />

      {/* User Info */}
      <UserInfoCard
        userId={data.user_id}
        emailId={data.email_id}
        collegeRollNumber={data.college_roll_number}
      />

      {/* Hierarchies */}
      {data.hierarchies && data.hierarchies.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/30 tracking-widest uppercase mb-4 ml-1">
            Hierarchies ({data.hierarchies.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.hierarchies.map((h, i) => (
              <HierarchyCard key={`${h.root}-${i}`} hierarchy={h} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Invalid & Duplicate — side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InvalidEntriesCard entries={data.invalid_entries} />
        <DuplicateEdgesCard edges={data.duplicate_edges} />
      </div>
    </section>
  );
}
