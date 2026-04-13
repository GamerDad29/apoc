interface Props {
  description: string;
  showSearch: boolean;
  onToggleSearch: () => void;
}

export default function RoomHeader({
  description,
  showSearch,
  onToggleSearch,
}: Props) {
  return (
    <div className="room-header">
      <span className="room-description">{description}</span>
      <div className="room-header-actions">
        <button
          className={`search-toggle ${showSearch ? 'active' : ''}`}
          onClick={onToggleSearch}
        >
          {showSearch ? 'CLOSE SEARCH' : 'SEARCH'}
        </button>
      </div>
    </div>
  );
}
