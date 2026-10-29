lucide.createIcons();

    // Product Selection Link Helper
    function selectProduct(type) {
      const cardRadio = document.querySelector('input[name="productChoice"][value="card"]');
      const acrylicRadio = document.querySelector('input[name="productChoice"][value="acrylic"]');
      if (type === 'card' && cardRadio) cardRadio.checked = true;
      if (type === 'acrylic' && acrylicRadio) acrylicRadio.checked = true;
      calculateTotal();
    }

    // Quantity Adjuster
    function adjustQty(delta) {
      const input = document.getElementById('orderQty');
      let val = parseInt(input.value) + delta;
      if (val < 1) val = 1;
      input.value = val;
      calculateTotal();
    }

    // Dynamic Price Calculator
    function calculateTotal() {
      const choice = document.querySelector('input[name="productChoice"]:checked').value;
      const qty = parseInt(document.getElementById('orderQty').value);
      const totalSpan = document.getElementById('displayTotal');
      const hostingSpan = document.getElementById('displayHosting');

      if (choice === 'card') {
        const total = 999 * qty;
        const hosting = 149 * qty;
        totalSpan.textContent = `₱${total.toLocaleString()}`;
        hostingSpan.textContent = `+ ₱${hosting}/mo hosting`;
        hostingSpan.style.display = 'inline-block';
      } else {
        const total = 899 * qty;
        totalSpan.textContent = `₱${total.toLocaleString()}`;
        hostingSpan.style.display = 'none';
      }
    }

    function handlePreOrderSubmit(e) {
      e.preventDefault();
      const form = document.getElementById('preOrderForm');
      if (!form.reportValidity()) return;
      alert('Your details were checked in this browser, but no order has been sent yet. Connect this form to an order backend or business email before accepting real pre-orders.');
    }

    // Keep the live preview accessible when the customer edits the name.
    // Rendering the name as artwork on the 3D surface can be added as a next step.
    function update3DText() {
      const input = document.getElementById('customNameInput');
      const name = input && input.value.trim() ? input.value.trim() : 'TapAsul product';
      ['studio3dCanvas', 'hero3dCanvas'].forEach((id) => {
        const container = document.getElementById(id);
        if (container) container.setAttribute('aria-label', `3D product preview for ${name}`);
      });
    }

    // --------------------------------------------------
    // THREE.JS 3D VIEWPORT ENGINE
    // --------------------------------------------------
    let scene, camera, renderer, cardMesh;
    let heroScene, heroCamera, heroRenderer, heroMesh;
    let currentColor = 0x0073e6;
    let studioControls;

    function createProductMesh(color, type = 'card') {
      const geometry = type === 'stand'
        ? new THREE.BoxGeometry(2.2, 3.0, 0.12)
        : new THREE.BoxGeometry(3.4, 2.1, 0.08);
      const material = new THREE.MeshStandardMaterial({
        color, roughness: 0.32, metalness: type === 'stand' ? 0.08 : 0.18
      });
      return new THREE.Mesh(geometry, material);
    }

    function initViewport(containerId, isHero = false) {
      const container = document.getElementById(containerId);
      if (!container || !window.THREE) return null;

      const localScene = new THREE.Scene();
      const localCamera = new THREE.PerspectiveCamera(45, Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1), 0.1, 1000);
      localCamera.position.set(0, 0, isHero ? 7 : 8);

      const localRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      localRenderer.setSize(container.clientWidth, container.clientHeight);
      localRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      localRenderer.domElement.setAttribute('aria-label', 'Interactive 3D product preview');
      container.appendChild(localRenderer.domElement);

      localScene.add(new THREE.AmbientLight(0xffffff, 0.85));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 5, 5);
      localScene.add(dirLight);

      const mesh = createProductMesh(currentColor);
      localScene.add(mesh);

      let controls = null;
      if (THREE.OrbitControls) {
        controls = new THREE.OrbitControls(localCamera, localRenderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = false;
      }

      const renderFrame = () => {
        requestAnimationFrame(renderFrame);
        if (controls) controls.update();
        localRenderer.render(localScene, localCamera);
      };
      renderFrame();

      const resizeObserver = new ResizeObserver(() => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (!width || !height) return;
        localCamera.aspect = width / height;
        localCamera.updateProjectionMatrix();
        localRenderer.setSize(width, height);
      });
      resizeObserver.observe(container);

      return { scene: localScene, camera: localCamera, renderer: localRenderer, mesh, controls, resizeObserver };
    }

    function init3DStudio() {
      const studio = initViewport('studio3dCanvas', false);
      if (studio) {
        scene = studio.scene;
        camera = studio.camera;
        renderer = studio.renderer;
        cardMesh = studio.mesh;
        studioControls = studio.controls;
      }
      const hero = initViewport('hero3dCanvas', true);
      if (hero) {
        heroScene = hero.scene;
        heroCamera = hero.camera;
        heroRenderer = hero.renderer;
        heroMesh = hero.mesh;
      }
    }

    function set3DColor(hex) {
      currentColor = new THREE.Color(hex).getHex();
      if (cardMesh) cardMesh.material.color.set(hex);
      if (heroMesh) heroMesh.material.color.set(hex);
    }

    function switch3DModel(type) {
      const btnCard = document.getElementById('btnModelCard');
      const btnStand = document.getElementById('btnModelStand');

      if (type === 'card') {
        btnCard.className = "px-4 py-2.5 rounded-xl font-medium text-sm bg-brand text-white border border-brand transition-all";
        btnStand.className = "px-4 py-2.5 rounded-xl font-medium text-sm bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 transition-all";
        if (cardMesh) {
          cardMesh.geometry.dispose();
          cardMesh.geometry = new THREE.BoxGeometry(3.4, 2.1, 0.08);
          cardMesh.scale.set(1, 1, 1);
        }
        if (heroMesh) {
          heroMesh.geometry.dispose();
          heroMesh.geometry = new THREE.BoxGeometry(3.4, 2.1, 0.08);
          heroMesh.scale.set(1, 1, 1);
        }
      } else {
        btnStand.className = "px-4 py-2.5 rounded-xl font-medium text-sm bg-brand text-white border border-brand transition-all";
        btnCard.className = "px-4 py-2.5 rounded-xl font-medium text-sm bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 transition-all";
        if (cardMesh) {
          cardMesh.geometry.dispose();
          cardMesh.geometry = new THREE.BoxGeometry(2.2, 3.0, 0.12);
          cardMesh.scale.set(1, 1, 1);
        }
        if (heroMesh) {
          heroMesh.geometry.dispose();
          heroMesh.geometry = new THREE.BoxGeometry(2.2, 3.0, 0.12);
          heroMesh.scale.set(1, 1, 1);
        }
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      if (window.lucide) lucide.createIcons();
      if (window.THREE) init3DStudio();
      calculateTotal();
    });
