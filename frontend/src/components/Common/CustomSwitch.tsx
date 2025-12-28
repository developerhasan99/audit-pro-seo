export const CustomSwitch = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onChange(!checked);
    }}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
      checked ? 'bg-indigo-600' : 'bg-slate-200'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);
