
import React from 'react';
import { RepoStatus } from '../types';

interface Props {
  status: RepoStatus;
}

const StatusBadge: React.FC<Props> = ({ status }) => {
  const styles = {
    [RepoStatus.GREEN]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    [RepoStatus.AUTO_FIXABLE]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    [RepoStatus.RED]: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    [RepoStatus.UNKNOWN]: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
