import useAuthStore from "../../../stores/useAuthStore";
import useAppStore from "../../../stores/useAppStore";
import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuCalendar } from "react-icons/lu";
import bookingApi from "../../../api/bookingApi";
import Modal from "../../layout/Modal";
import { useTranslation } from "react-i18next";

const BookingProfile = () => {
  const { t, i18n } = useTranslation();
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);
  const [bookings, setBookings] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const removeVietnameseTones = (str) => {
    if (!str) return "";
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẹ|Ẽ|Ê|B|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    return str;
  };

  const shortCode = (code) => code?.substring(0, 8).toUpperCase() || "N/A";

  const fetchData = async (pageNum) => {
    setIsFetching(true);
    try {
      const res = await bookingApi.getBookingCustomer(pageNum, 10).catch(err => {
        // API Error
        return { list: [], totalPages: 0 };
      });

      const getList = (res) => {
        const apiRes = res?.data || res;
        if (!apiRes) return [];
        const mainData = apiRes.data !== undefined ? apiRes.data : apiRes;
        if (Array.isArray(mainData)) return mainData;
        if (mainData?.content && Array.isArray(mainData.content)) return mainData.content;
        if (mainData?.list && Array.isArray(mainData.list)) return mainData.list;
        return [];
      };

      const list = getList(res);
      setBookings(list);
      setTotalPages(res.totalPages || (res.data?.totalPages) || 1);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (loading || !user) return;
    fetchData(page);
  }, [loading, user, page]);

  const statusMap = {
    CONFIRMED: { label: t('user.booking.statuses.CONFIRMED'), class: "bg-blue-100 text-blue-700" },
    PENDING: { label: t('user.booking.statuses.PENDING'), class: "bg-yellow-100 text-yellow-700" },
    CANCELLED: { label: t('user.booking.statuses.CANCELLED'), class: "bg-red-100 text-red-700" },
    COMPLETED: { label: t('user.booking.statuses.COMPLETED'), class: "bg-emerald-500 text-white" },
  };

  const getStatus = (status) => {
    const s = statusMap[status] || { label: t('user.booking.statuses.UNKNOWN'), class: "bg-gray-100 text-gray-600" };
    return <span className={`px-2.5 py-1 rounded-full text-[13px] font-semibold ${s.class}`}>{s.label}</span>;
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse border-b border-gray-50">
      <td className="py-4 px-4"><div className="h-3 w-12 bg-gray-200 rounded"></div></td>
      <td className="py-4 px-4"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
      <td className="py-4 px-4"><div className="h-3 w-32 bg-gray-200 rounded"></div></td>
      <td className="py-4 px-4"><div className="h-3 w-28 bg-gray-200 rounded"></div></td>
      <td className="py-4 px-4"><div className="h-6 w-20 bg-gray-200 rounded-full"></div></td>
      <td className="py-4 px-4"><div className="h-8 w-8 bg-gray-100 rounded-lg"></div></td>
    </tr>
  );

  if (loading) return (
    <div className="animate-pulse space-y-4 py-8">
      <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-6"></div>
      <div className="h-64 w-full bg-gray-100 rounded-xl"></div>
    </div>
  );

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('user.booking.order_id')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('user.account.name')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('user.booking.date')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('common.services')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('user.booking.status')}</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b.bookingCode} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{shortCode(b.bookingCode)}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {i18n.language === 'en' ? removeVietnameseTones(b.customerName) : b.customerName}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{b.recordDate}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {b.services?.map(s => typeof s === 'string' ? s : s.name).join(", ") || "N/A"}
                  </td>
                  <td className="py-3 px-4">{getStatus(b.status)}</td>
                  <td className="py-3 px-4">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700" onClick={() => setSelectedBooking(b)}>
                      <BsThreeDotsVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                      <LuCalendar size={24} />
                    </div>
                    <p className="text-gray-400 font-medium">{t('user.booking.no_data')}</p>

                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-4 border-t border-gray-100">
            <button className="px-4 py-1.5 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>{t('common.prev', 'Previous')}</button>
            <span className="text-sm text-gray-500">{t('common.page', 'Page')} {page + 1} / {totalPages}</span>
            <button className="px-4 py-1.5 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>{t('common.next', 'Next')}</button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={t('user.booking.view_detail')}

        content={selectedBooking && (
          <div className="flex flex-col gap-3" key={selectedBooking.bookingCode}>
            {[
              [t('user.booking.order_id'), shortCode(selectedBooking.bookingCode)],
              [t('user.account.name'), i18n.language === 'en' ? removeVietnameseTones(selectedBooking.customerName) : selectedBooking.customerName],
              [t('user.booking.date'), selectedBooking.recordDate],
              [t('common.services', 'Services'), selectedBooking.services?.join(", ")],
              [t('common.note', 'Note'), selectedBooking.note || t('common.no_note', 'No note')],
              [t('common.studio_room', 'Studio Room'), selectedBooking.studioRoom],
            ].map(([label, val]) => (
              <p key={label} className="text-sm"><strong className="text-gray-800">{label}:</strong> <span className="text-gray-600">{val}</span></p>
            ))}
            <p className="text-sm"><strong className="text-gray-800">{t('user.booking.status')}:</strong> {getStatus(selectedBooking.status)}</p>

          </div>
        )}
      />
    </div>
  );
};

export default BookingProfile;
