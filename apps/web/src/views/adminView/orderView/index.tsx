import AdminLayout from '@/layouts/adminLayouts';
import OrderSectionManagement from '@/components/adminDashboard/orderManagement';

const AdminOrderView: React.FC = () => {
    return (
        <AdminLayout>
            <OrderSectionManagement />
        </AdminLayout>
    );
};

export default AdminOrderView;