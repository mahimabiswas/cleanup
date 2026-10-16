// Status pill: always a text label, colour is only a second cue.
const LABELS = {
  open: 'Open',
  accepted: 'Accepted',
  review: 'Waiting for approval',
  done: 'Done',
  sent: 'Sent back',
  rejected: 'Rejected',
  crew: 'Council crew only',
};

export default function Pill({ status, children }) {
  return <span className={'pill ' + status}>{children || LABELS[status]}</span>;
}
