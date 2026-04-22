const fs = require('fs');
const path = require('path');

const directory = 'e:\\HoangHuyAnh\\huyanhstudio-app\\src';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? 
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(directory, function(filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes('AuthContext')) {
        // Calculate relative path to useAuthStore and useAppStore based on current file depth
        const depth = filePath.split(path.sep).length - directory.split(path.sep).length;
        const relativePrefix = depth <= 1 ? './' : '../'.repeat(depth - 1);
        const authStorePath = `${relativePrefix}stores/useAuthStore`;
        const appStorePath = `${relativePrefix}stores/useAppStore`;

        // 1. Remove AuthContext import
        content = content.replace(/import\s+\{\s*AuthContext\s*\}\s+from\s+['"].*?AuthContext['"];?\n?/g, '');
        
        // 2. Add Zustand imports if not present, but only if they are needed in the file
        if (content.includes('useContext(AuthContext)')) {
             if (!content.includes('useAuthStore')) {
                 content = `import useAuthStore from "${authStorePath}";\nimport useAppStore from "${appStorePath}";\n` + content;
             }
             
             // 3. Very basic automatic replacement for common destructuring patterns
             content = content.replace(/const\s+\{\s*user(.*?)\}\s*=\s*useContext\(AuthContext\);?/g, 'const user = useAuthStore(state => state.user);');
             content = content.replace(/const\s+\{\s*loading(.*?)\}\s*=\s*useContext\(AuthContext\);?/g, 'const loading = useAuthStore(state => state.loading);');
             content = content.replace(/const\s+\{\s*logout(.*?)\}\s*=\s*useContext\(AuthContext\);?/g, 'const logout = useAuthStore(state => state.logout);');
             content = content.replace(/const\s+\{\s*setShowLoginModal(.*?)\}\s*=\s*useContext\(AuthContext\);?/g, 'const setShowLoginModal = useAppStore(state => state.setShowLoginModal);');
             
             // Blanket replace any remaining `const { a, b } = useContext(AuthContext)` with a warning or fallback to get everything
             content = content.replace(/const\s+\{.*\}\s*=\s*useContext\(AuthContext\);?/g, 
                'const { user, loading, logout } = useAuthStore();\n  const setShowLoginModal = useAppStore(state => state.setShowLoginModal);'
             );
        }

        // Cleanup empty AuthContext usage
        content = content.replace(/useContext\(AuthContext\)/g, '{}');
        
        fs.writeFileSync(filePath, content);
        console.log(`Refactored: ${filePath}`);
    }
});
