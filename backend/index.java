public class index {
    public static void main(String[] args) {
        // 1. In câu chào cơ bản
        System.out.println("Tôi là Nguyễn Trung Kiên");

        // 2. Khai báo thêm các biến thông tin
        int tuoi = 18; // Bạn có thể thay đổi số tuổi ở đây
        String diaChi = "Hà Nội";
        int namHienTai = 2024;

        // 3. Thực hiện một phép tính đơn giản
        int namSinh = namHienTai - tuoi;

        // 4. In thông tin chi tiết ra màn hình
        System.out.println("--------------------------------");
        System.out.println("THÔNG TIN CHI TIẾT:");
        System.out.println("- Tuổi: " + tuoi);
        System.out.println("- Quê quán: " + diaChi);
        System.out.println("- Năm sinh dự kiến: " + namSinh);
        
        // 5. Thêm một dòng điều kiện (Logic)
        if (tuoi >= 18) {
            System.out.println("- Trạng thái: Đã đủ tuổi công dân.");
        } else {
            System.out.println("- Trạng thái: Vị thành niên.");
        }
        System.out.println("--------------------------------");
    }
}
