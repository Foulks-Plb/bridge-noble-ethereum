export default function ButtonAction({active, title}: {active: boolean; title: string}) {
  return (
    <button
      type="submit"
      className="mt-28 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      style={{
        opacity: active ? 1 : 0.6,
      }}
      disabled={!active}
    >
      {title}
    </button>
  );
}
