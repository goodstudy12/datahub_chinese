import { t } from '@i18n/utils';

class AutoTranslateService {
    private translatedKeys = new Set<string>();

    public translatePage() {
        this.walkAndTranslate(document.body);
    }

    private walkAndTranslate(element: Element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
        );

        const textNodes: Text[] = [];
        let node = walker.nextNode();

        // 收集所有需要翻译的文本节点
        while (node) {
            if (this.shouldTranslate(node)) {
                textNodes.push(node as Text);
            }
            node = walker.nextNode();
        }

        // 处理文本节点替换
        textNodes.forEach(textNode => {
            const originalText = textNode.nodeValue?.trim() || '';
            const translated = t(originalText);

            if (translated && translated !== originalText) {
                const newNode = document.createTextNode(translated);
                textNode.parentNode?.replaceChild(newNode, textNode);
            }
        });
    }

    private shouldTranslate(node: Node): boolean {
        const text = node.nodeValue?.trim() || '';
        return !!text &&
            !node.parentElement?.hasAttribute('data-no-translate') &&
            /[a-zA-Z]/.test(text); // 包含英文字符才翻译
    }
}

export const autoTranslateService = new AutoTranslateService();