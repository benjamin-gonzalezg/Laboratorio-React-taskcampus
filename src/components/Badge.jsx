export default function Badge({ texto }) {
  return <span className={`badge badge-${texto}`}>{texto}</span>;
}
