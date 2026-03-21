const vueTemplate = /*vue*/`
    <template>
        <slot :foo="{ foo: bar, baz }"/>
    </template>
`
const vueScript = /*vue*/`
    <script>
        export default {
            name: 'MyComponent',
        }
    </script>
`

const vueScriptSetup = /*vue*/`
    <script setup>
        import { ref } from 'vue'
        export default {
            name: 'MyComponent',
        }
    </script>

    <template>
        <slot :foo="foo.bar.baz"/>
    </template>
`

const vueCss = /*vue*/`
    <style scoped>
        main {
            color: red;
        }
    </style>
`

const vueDirectives = /*vue*/`
    <template>
        <div v-if="isVisible">Show me</div>
        <div v-else-if="isHidden">Hidden content</div>
        <div v-else>Fallback</div>
        
        <ul>
            <li v-for="item in items" :key="item.id">
                {{ item.name }}
            </li>
        </ul>
        
        <input v-model="inputValue" @input="onInput" />
        <button @click="handleClick">Click me</button>
        <Component #item="{ item: itemSlot }">
		    <slot name="item" :item="itemSlot"></slot>
	    </Component>
    </template>
`

const vueEmbedPug = /*vue*/`
    <template lang="pug">
        p {{ msg }}
    </template>
`