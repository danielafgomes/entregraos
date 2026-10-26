"""Dependency-free audit of future production and optional protected preview pages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
ORIGIN = 'https://www.entregraos.pt/'

class Page(HTMLParser):
    def __init__(self, filename):
        super().__init__(convert_charrefs=True)
        self.filename = filename
        self.tags = []
        self.feed(filename.read_text())
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))
    def select(self, tag=None, **attrs):
        return [a for t, a in self.tags if (tag is None or t == tag) and all(a.get(k) == v for k, v in attrs.items())]

def check(folder, preview=False):
    for suffix, language in [('', 'pt-PT'), ('en/', 'en')]:
        filename = folder / suffix / 'index.html'
        html = filename.read_text()
        page = Page(filename)
        assert page.select('html', lang=language), filename
        assert len(page.select('h1')) == 1
        assert len(page.select('main')) == 1
        ids = [a['id'] for _, a in page.tags if 'id' in a]
        assert len(ids) == len(set(ids)), 'Duplicate IDs'
        assert len(page.select('meta', name='description')) == 1
        assert len(page.select('title')) == 1
        assert page.select('main', tabindex='-1')
        assert page.select('noscript'), 'Missing no-JavaScript navigation fallback'
        assert page.select('button', **{'class': 'menu-toggle'})[0].get('hidden') is None
        assert 'hidden' in page.select('button', **{'class': 'menu-toggle'})[0]
        assert not any(key in html for key in ['hero-address', 'tableIntro', 'space-address', 'spaceDescription2', 'journal-note', 'service-hours', 'brunchCta'])
        assert not re.search(r'[—–€]', html)
        assert '12:00 às 15:00' in html if language == 'pt-PT' else '12:00 to 15:00' in html
        assert html.index('data-i18n="sandwichTitle"') < html.index('data-i18n="soupTitle"')
        if preview:
            assert page.select('meta', name='robots', content='noindex,nofollow,noarchive')
            assert page.select('meta', name='googlebot', content='noindex,nofollow')
            assert not page.select('link', rel='canonical')
            assert not page.select('link', rel='alternate')
            assert not page.select('script', type='application/ld+json')
            assert not page.select('meta', property='og:url')
        else:
            assert page.select('link', rel='canonical', href=ORIGIN + suffix)
            for lang, url in [('pt-PT', ORIGIN), ('en', ORIGIN + 'en/'), ('x-default', ORIGIN)]:
                assert page.select('link', rel='alternate', hreflang=lang, href=url)
            assert not page.select('meta', name='robots')
            schema = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)[1])
            assert schema['@type'] == 'CafeOrCoffeeShop'
            assert schema['telephone'] == '+351928205424'
            assert schema['address']['streetAddress'] == 'Rua da Cale 75'
            assert schema['openingHoursSpecification'][-1] == {'@type': 'OpeningHoursSpecification', 'dayOfWeek': 'Sunday', 'opens': '00:00', 'closes': '00:00'}
            assert not any(k in schema for k in ['priceRange', 'aggregateRating', 'review', 'geo'])
        language_links = [a for a in page.select('a') if a.get('hreflang')]
        assert {a['hreflang'] for a in language_links} == {'pt-PT', 'en'}
        assert len([a for a in language_links if a.get('aria-current') == 'page']) == 1
        for tag, attrs in page.tags:
            if tag == 'img':
                assert all(attrs.get(k) for k in ['src', 'alt', 'width', 'height'])
            if tag == 'svg':
                assert all(attrs.get(k) for k in ['width', 'height', 'viewbox'])
            for name in ['src', 'href']:
                if name not in attrs:
                    continue
                value = attrs[name]
                assert value.strip(), 'Empty URL attribute'
                parts = urlsplit(value)
                if parts.scheme or parts.netloc:
                    if name == 'src':
                        raise AssertionError('Unexpected external resource: ' + value)
                    continue
                assert not value.startswith('/'), 'Use portable relative URLs'
                target = (filename.parent / unquote(parts.path)).resolve() if parts.path else filename
                if target.is_dir():
                    target /= 'index.html'
                assert target.is_file(), f'Missing local target: {filename}: {value}'
                if preview:
                    assert target.is_relative_to(folder.resolve()), 'Link escapes preview'
                if parts.fragment and target.suffix == '.html':
                    assert any(a.get('id') == parts.fragment for _, a in Page(target).tags), value
        print('PASS', filename.relative_to(folder), 'protected preview' if preview else 'future production')

check(ROOT)
if len(sys.argv) > 1:
    check(Path(sys.argv[1]).resolve(), preview=True)
robots = (ROOT / 'robots.txt').read_text()
assert 'Disallow:' not in robots and 'Sitemap: ' + ORIGIN + 'sitemap.xml' in robots
sitemap = ET.parse(ROOT / 'sitemap.xml')
urls = [e.text for e in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert urls == [ORIGIN, ORIGIN + 'en/']
script = (ROOT / 'script.js').read_text()
assert all(k not in script for k in ['localStorage', 'sessionStorage', 'document.cookie', 'setLanguage'])
css = (ROOT / 'style.css').read_text()
assert '@import' not in css and 'https://' not in css
print('PASS sitemap, crawler access, no browser storage, no remote fonts or CSS')
