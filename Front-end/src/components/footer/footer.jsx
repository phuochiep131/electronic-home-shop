import React from 'react';
import './footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-column footer-about">
                    <h3 className="footer-title">Về ELECTRONIC-HOME-SHOP</h3>
                    <p>Chúng tôi chuyên cung cấp các sản phẩm điện gia dụng chính hãng, chất lượng cao với giá cả cạnh tranh. Mang lại sự tiện nghi và hiện đại cho ngôi nhà của bạn là sứ mệnh của chúng tôi.</p>
                </div>

                <div className="footer-column footer-links">
                    <h3 className="footer-title">Hỗ trợ khách hàng</h3>
                    <ul>
                        <li><a href="/faq">Câu hỏi thường gặp</a></li>
                        <li><a href="/shipping">Chính sách giao hàng</a></li>
                        <li><a href="/warranty">Chính sách bảo hành</a></li>
                        <li><a href="/returns">Chính sách đổi trả</a></li>
                    </ul>
                </div>

                <div className="footer-column footer-contact">
                    <h3 className="footer-title">Thông tin liên hệ</h3>
                    <p><i className="fas fa-map-marker-alt"></i> 123 Đường ABC, Quận 1, TP. HCM</p>
                    <p><i className="fas fa-phone"></i> Hotline: (028) 3812 3456</p>
                    <p><i className="fas fa-envelope"></i> Email: support@electronichomeshop.com</p>
                    <div className="social-icons">
                        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                        <a href="#" aria-label="Tiktok"><i className="fab fa-tiktok"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 ELECTRONIC-HOME-SHOP. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;