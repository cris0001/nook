import type { Point } from './chart-frame';

// The chart's numbers for screen readers (the SVG itself is one labelled image).
export function ChartTable({ label, points }: { label: string; points: Point[] }) {
  return (
    <table className="sr-only">
      <caption>{label}</caption>
      <tbody>
        {points.map((point) => (
          <tr key={point.key}>
            <th scope="row">{point.label}</th>
            <td>{point.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
