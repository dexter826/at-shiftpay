import React, { memo, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Location, Event } from '@/types/index';
import { locationService } from '@/lib/api/locationService';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import LocationToolbar, {
  type LocationFilter,
  type LocationSort,
} from '@/features/location/components/LocationToolbar';
import LocationList from '@/features/location/components/LocationList';
import LocationFormModal, {
  type LocationFormData,
} from '@/features/location/components/LocationFormModal';
import LocationDetailModal from '@/features/location/components/LocationDetailModal';

interface LocationViewProps {
  locations: Location[];
  events: Event[];
  loading?: boolean;
}

const LocationView: React.FC<LocationViewProps> = ({ locations, events, loading = false }) => {
  const { user } = useAuthStore();
  const userId = user?.uid || '';
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<LocationFilter>('all');
  const [sortBy, setSortBy] = useState<LocationSort>('newest');
  const [visibleCount, setVisibleCount] = useState(12);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [viewingLocation, setViewingLocation] = useState<Location | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetPagination = () => setVisibleCount(12);

  const eventCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((event) => {
      if (event.locationId) {
        counts[event.locationId] = (counts[event.locationId] || 0) + 1;
      }
    });
    return counts;
  }, [events]);

  const filteredLocations = useMemo(() => {
    const searchLower = searchTerm.trim().toLowerCase();

    return locations
      .filter((location) => {
        const matchesSearch =
          !searchLower ||
          location.name.toLowerCase().includes(searchLower) ||
          (location.address || '').toLowerCase().includes(searchLower) ||
          (location.reviewNote || '').toLowerCase().includes(searchLower);
        const matchesFilter =
          filterType === 'all' ||
          (filterType === 'none' ? !location.review : location.review === filterType);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name, 'vi');
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        const countDiff = (eventCounts[b.id] || 0) - (eventCounts[a.id] || 0);
        return countDiff !== 0 ? countDiff : a.name.localeCompare(b.name, 'vi');
      });
  }, [locations, searchTerm, filterType, sortBy, eventCounts]);

  const stats = useMemo(() => {
    const high = locations.filter((location) => location.review === 'high').length;
    const low = locations.filter((location) => location.review === 'low').length;
    return { high, low, total: locations.length };
  }, [locations]);

  const summary = useMemo(() => {
    const parts = [`${stats.total} địa điểm`];
    if (stats.high > 0) parts.push(`${stats.high} tốt`);
    if (stats.low > 0) parts.push(`${stats.low} kém`);
    return parts.join(' · ');
  }, [stats]);

  const hasActiveFilters = searchTerm.trim().length > 0 || filterType !== 'all';

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    resetPagination();
  };

  const handleOpenAdd = () => {
    setEditingLocation(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (location: Location) => {
    setEditingLocation(location);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: LocationFormData) => {
    try {
      if (editingLocation) {
        await locationService.updateLocation(editingLocation.id, data);
        showToast('Đã cập nhật địa điểm.', 'success');
      } else {
        await locationService.addLocation(data, userId);
        showToast('Đã thêm địa điểm.', 'success');
      }
      setIsFormOpen(false);
      setEditingLocation(null);
    } catch (error) {
      console.error(error);
      showToast('Không thể lưu địa điểm. Thử lại.', 'error');
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;

    setIsDeleting(true);
    try {
      await locationService.deleteLocation(deleteTarget.id);
      showToast('Đã xóa địa điểm.', 'success');
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      showToast('Không thể xóa địa điểm. Thử lại.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteEventCount = deleteTarget ? eventCounts[deleteTarget.id] || 0 : 0;

  return (
    <div className="min-h-dynamic bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-6 md:py-6">
        <header className="flex flex-col gap-4 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-mono-label text-ink-muted">
              {loading ? 'Đang tải địa điểm' : summary}
            </p>
            <h1 className="mt-1 text-display text-ink">Sổ địa điểm</h1>
          </div>
          <Button onClick={handleOpenAdd} icon={<Plus size={16} />}>
            Thêm địa điểm
          </Button>
        </header>

        <div className="mt-4 space-y-3">
          <LocationToolbar
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              resetPagination();
            }}
            onClearSearch={() => {
              setSearchTerm('');
              resetPagination();
            }}
            filterType={filterType}
            onFilterChange={(value) => {
              setFilterType(value);
              resetPagination();
            }}
            sortBy={sortBy}
            onSortChange={(value) => {
              setSortBy(value);
              resetPagination();
            }}
          />

          <LocationList
            loading={loading}
            locations={filteredLocations}
            totalLocations={locations.length}
            hasActiveFilters={hasActiveFilters}
            visibleCount={visibleCount}
            onLoadMore={() =>
              setVisibleCount((current) => Math.min(current + 12, filteredLocations.length))
            }
            eventCounts={eventCounts}
            onEdit={handleOpenEdit}
            onDelete={(locationId) => {
              const location = locations.find((item) => item.id === locationId);
              if (location) setDeleteTarget(location);
            }}
            onViewDetail={setViewingLocation}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {isFormOpen && (
        <LocationFormModal
          isOpen
          onClose={() => {
            setIsFormOpen(false);
            setEditingLocation(null);
          }}
          editingLocation={editingLocation}
          locations={locations}
          onSubmit={handleFormSubmit}
        />
      )}

      {viewingLocation && (
        <LocationDetailModal
          isOpen
          onClose={() => setViewingLocation(null)}
          location={viewingLocation}
          events={events}
          onEditClick={handleOpenEdit}
        />
      )}

      <Modal
        title="Xóa địa điểm?"
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              className="flex-1"
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              className="flex-1"
              loading={isDeleting}
            >
              Xóa địa điểm
            </Button>
          </div>
        }
      >
        {deleteTarget && (
          <p className="text-body-sm text-ink-soft">
            {deleteEventCount > 0 ? (
              <>
                “{deleteTarget.name}” và {deleteEventCount} sự kiện liên quan sẽ mất liên kết địa
                điểm. Các sự kiện không bị xóa. Không thể hoàn tác.
              </>
            ) : (
              <>“{deleteTarget.name}” sẽ bị xóa. Không thể hoàn tác.</>
            )}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default memo(LocationView);
