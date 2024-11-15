exports.getHomePage = (req, res) => {
    try {
        // Успешный ответ со статусом 200
        res.status(200).json({ message: 'Welcome to the Home Page!' });
    } catch (error) {
        console.error('Error on Home Page:', error);
        // Ошибка сервера со статусом 500
        res.status(500).json({ message: 'Server error' });
    }
};
